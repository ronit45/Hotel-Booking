import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../store/auth";
import "../login/login.css"; // reuse styles

const Register = () => {
  const navigate = useNavigate();
  const { loginStart, loginSuccess, loginFailure, loading, error } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    phone: "",
    city: "",
    img: "" // will store Cloudinary URL
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD || 'dykd0movr';
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_PRESET || 'upload';

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((f) => ({ ...f, [id]: value }));
  };

  const uploadImageIfNeeded = async () => {
    if (!file) return null;
    try {
      setUploading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', UPLOAD_PRESET);
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, data, { withCredentials: false });
      return res.data.secure_url || res.data.url;
    } catch (err) {
      console.error('Cloudinary upload failed', err.response?.data || err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic required fields check (backend also enforces)
    if (!form.username || !form.email || !form.password || !form.country || !form.phone) {
      return alert("Please fill all required fields");
    }
    loginStart();
    try {
      let imageUrl = form.img;
      if (!imageUrl && file) {
        imageUrl = await uploadImageIfNeeded();
      }
      const registerBody = { ...form, img: imageUrl };
      const registerRes = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, registerBody);
      console.log("REGISTER RESPONSE", registerRes.data);
      // Immediately login to obtain tokens
      const loginPayload = { username: form.username, password: form.password };
      const loginRes = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, loginPayload, { withCredentials: true });
      console.log("AUTO LOGIN RESPONSE", loginRes.data);
      const userObj = loginRes.data.user || loginRes.data.data?.user || loginRes.data.details || loginRes.data;
      loginSuccess(userObj);
      navigate("/");
    } catch (err) {
      console.error("REGISTER ERROR", err.response?.data || err.message);
      loginFailure(err.response?.data || err.message);
    }
  };

  return (
    <div className="login">{/* reuse gradient background */}
      <form className="lContainer" onSubmit={handleSubmit}>
        <h2 style={{marginBottom:'4px'}}>Create Account</h2>
        <p style={{marginTop:0, fontSize:'12px', color:'#666'}}>Already have an account? <Link to="/login">Sign in</Link></p>
        <input id="username" placeholder="Username *" value={form.username} onChange={handleChange} />
        <input id="email" type="email" placeholder="Email *" value={form.email} onChange={handleChange} />
        <input id="password" type="password" placeholder="Password *" value={form.password} onChange={handleChange} />
        <input id="country" placeholder="Country *" value={form.country} onChange={handleChange} />
        <input id="phone" placeholder="Phone *" value={form.phone} onChange={handleChange} />
        <input id="city" placeholder="City" value={form.city} onChange={handleChange} />
        <input id="img" placeholder="Image URL (optional if uploading file)" value={form.img} onChange={handleChange} />
        <div style={{textAlign:'left', width:'100%'}}>
          <input type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
          {file && (
            <div style={{marginTop:8}}>
              <img src={URL.createObjectURL(file)} alt="preview" style={{width:'100%', maxHeight:180, objectFit:'cover', borderRadius:8}} />
              {uploading && <div style={{fontSize:12, color:'#555'}}>Uploading...</div>}
            </div>
          )}
        </div>
        <button className="lButton" disabled={loading || uploading} type="submit">{loading || uploading ? 'Processing...' : 'Sign Up'}</button>
        {error && <span style={{color:'crimson', fontSize:'12px', marginTop:'6px'}}>{error.message || error}</span>}
      </form>
    </div>
  );
};

export default Register;
