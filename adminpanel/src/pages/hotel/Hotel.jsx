import React, { useEffect, useState, useContext } from 'react';
import api from '../../utils/axios';
import axios from 'axios';
import './hotel.css';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Hotel = () => {
  const {hotelId : id } = useParams();
  console.log(id)
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [files, setFiles] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const fetchHotel = async () => {
      try {
        const res = await api.get(`/api/hotels/find/${id}`);
        setHotel(res.data);
      } catch (err) {
        setError(err.response?.data || err.message);
      }
    };

    const fetchRooms = async () => {
      try {
        const res = await api.get(`/api/hotels/room/${id}`);
        setRooms(res.data || []);
      } catch (err) {
        setRooms([]);
      }
    };

    Promise.all([fetchHotel(), fetchRooms()]).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (hotel) {
      setForm({
        name: hotel.name || '',
        city: hotel.city || '',
        address: hotel.address || '',
        type: hotel.type || '',
        distance: hotel.distance || '',
        title: hotel.title || '',
        desc: hotel.desc || '',
        cheapestPrice: hotel.cheapestPrice || '',
        featured: hotel.featured || false,
      });
    }
  }, [hotel]);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleToggleEdit = () => setIsEditing(v => !v);

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = { ...form };

      if (payload.cheapestPrice !== '') payload.cheapestPrice = Number(payload.cheapestPrice);
      if (files && files.length > 0) {
        try {
          const list = await Promise.all(
            Object.values(files).map(async (file) => {
              const data = new FormData();
              data.append('file', file);
              data.append('upload_preset', 'upload');
              const uploadRes = await axios.post('https://api.cloudinary.com/v1_1/dykd0movr/image/upload', data, { withCredentials: false });
              return uploadRes.data.secure_url || uploadRes.data.url || null;
            })
          );
          payload.photos = list.filter(Boolean);
          console.log(payload)
        } catch (upErr) {
          console.error('Cloudinary upload failed', upErr.response?.data || upErr.message || upErr);
        }
      }

      if (user && user.accessToken) {
        api.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`;
      }

  console.log('PUT payload:', payload);
  const res = await api.put(`/api/hotels/find/${id}`, payload);
  console.log('PUT response:', res.data);
  if (res?.data) setHotel(res.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-hotel">Loading...</div>;
  if (error) return <div className="admin-hotel">Error: {JSON.stringify(error)}</div>;
  return (
    <div className="admin-hotel">
      <h1 className="admin-hotel-title">Hotel Details</h1>
      {hotel ? (
        <div className="hotel-details">
          <div className="hotel-main-image">
            
            <img
              src={
                isEditing && files && files.length > 0
                  ? URL.createObjectURL(files[0])
                  : (hotel.photos && hotel.photos.length > 0
                      ? hotel.photos[0]
                      : 'https://upload.wikimedia.org/wikipedia/commons/0/0a/No-image-available.png')
              }
              alt={hotel.name || 'hotel-image'}
              className="hotel-main-photo"
            />
          </div>
          <div className="hotel-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h2 style={{ margin: 0 }}>{hotel.name}</h2>
              <div>
                {!isEditing && <button onClick={handleToggleEdit}>Edit</button>}
                {isEditing && (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => { setIsEditing(false); setForm({ ...hotel }); }}>Cancel</button>
                  </>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="hotel-edit-form" style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                <label style={{ fontSize: 12 }}>Upload Photos (optional)</label>
                <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
                <input name="name" value={form.name} onChange={handleInput} placeholder="Name" />
                <input name="city" value={form.city} onChange={handleInput} placeholder="City" />
                <input name="address" value={form.address} onChange={handleInput} placeholder="Address" />
                <input name="type" value={form.type} onChange={handleInput} placeholder="Type" />
                <input name="distance" value={form.distance} onChange={handleInput} placeholder="Distance" />
                <input name="title" value={form.title} onChange={handleInput} placeholder="Title" />
                <textarea name="desc" value={form.desc} onChange={handleInput} placeholder="Description" />
                <input name="cheapestPrice" value={form.cheapestPrice} onChange={handleInput} placeholder="Cheapest Price" />
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleInput} /> Featured
                </label>
              </div>
            ) : (
              <>
                <p className="hotel-city">{hotel.city} — {hotel.address}</p>
                <p className="hotel-desc">{hotel.desc}</p>
                <p className="hotel-meta">Type: {hotel.type} · Distance: {hotel.distance} · Rating: {hotel.rating ?? 'N/A'}</p>
                <p className="hotel-price">Starting from: ${hotel.cheapestPrice}</p>
              </>
            )}
          </div>
          <div className="hotel-photos">
            {(hotel.photos || []).map((p, idx) => (
              <img key={idx} src={p} alt={`photo-${idx}`} className="hotel-photo" />
            ))}
          </div>
        </div>
      ) : (
        <div>No hotel data</div>
      )}

      <h2 className="rooms-title">Rooms</h2>
      <div className="rooms-list">
        {rooms.length === 0 && <div>No rooms found</div>}
        {rooms.map(r => (
          <div key={r._id} className="room-card">
            <h3>{r.title || r._id}</h3>
            <p>Price: ${r.price}</p>
            <p>Max People: {r.maxPeople}</p>
            <p>Desc: {r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotel;
