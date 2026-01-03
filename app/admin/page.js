'use client';

import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function Admin() {
  const [websites, setWebsites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    icon: '',
    category: 'education',
    order: 0,
    isNew: false,
    style: 'bg-gradient-to-br from-white/10 to-white/5'
  });

  const ADMIN_PASSWORD = 'admin1414'; // Change this to your secure password

  useEffect(() => {
    if (isAuthenticated) {
      fetchWebsites();
    }
  }, [isAuthenticated]);

  const fetchWebsites = async () => {
    try {
      const q = query(collection(db, 'websites'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const sitesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWebsites(sitesData);
    } catch (error) {
      console.error('Error fetching websites:', error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'websites', editingId), formData);
        alert('Website updated successfully!');
      } else {
        await addDoc(collection(db, 'websites'), formData);
        alert('Website added successfully!');
      }
      resetForm();
      fetchWebsites();
    } catch (error) {
      console.error('Error saving website:', error);
      alert('Error saving website');
    }
  };

  const handleEdit = (site) => {
    setFormData(site);
    setEditingId(site.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this website?')) {
      try {
        await deleteDoc(doc(db, 'websites', id));
        alert('Website deleted successfully!');
        fetchWebsites();
      } catch (error) {
        console.error('Error deleting website:', error);
        alert('Error deleting website');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      url: '',
      icon: '',
      category: 'education',
      order: 0,
      isNew: false,
      style: 'bg-gradient-to-br from-white/10 to-white/5'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const styleOptions = [
    { value: 'bg-gradient-to-br from-white/10 to-white/5', label: 'Default (Blue)' },
    { value: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20', label: 'Purple Pink' },
    { value: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20', label: 'Green' },
    { value: 'bg-gradient-to-br from-orange-500/20 to-red-500/20', label: 'Orange Red' },
    { value: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20', label: 'Yellow' },
    { value: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20', label: 'Cyan Blue' },
    { value: 'bg-gradient-to-br from-rose-500/20 to-pink-500/20', label: 'Rose Pink' },
    { value: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20', label: 'Indigo Purple' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20"
        >
          <div className="text-center mb-8">
            <Image src="/tsok-logo.png" alt="TSOK" width={100} height={100} className="mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-blue-200">Enter password to access admin panel</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src="/tsok-logo.png" alt="TSOK" width={60} height={60} />
              <div>
                <h1 className="text-2xl font-bold text-white">TSOK HUB Admin</h1>
                <p className="text-blue-200 text-sm">Manage your websites</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                View Site
              </a>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Website Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
          >
            {showForm ? '✕ Cancel' : '+ Add New Website'}
          </button>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingId ? 'Edit Website' : 'Add New Website'}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white mb-2 font-semibold">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">
                    Icon URL <span className="text-blue-300 text-sm font-normal">(Optional - Uses TSOK logo if empty)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    placeholder="https://example.com/icon.png"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <p className="text-xs text-blue-300 mt-1">Leave empty to use TSOK logo as default icon</p>
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="education, tools, etc."
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-semibold">Card Style</label>
                  <select
                    value={formData.style}
                    onChange={(e) => setFormData({...formData, style: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {styleOptions.map(option => (
                      <option key={option.value} value={option.value} className="bg-blue-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                      className="mr-2 w-5 h-5"
                    />
                    <span className="font-semibold">Mark as NEW</span>
                  </label>
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
                  >
                    {editingId ? 'Update Website' : 'Add Website'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-white/10 text-white px-6 py-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Websites List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Current Websites ({websites.length})</h2>
          
          <div className="space-y-4">
            {websites.map((site) => (
              <motion.div
                key={site.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Image 
                        src={site.icon || '/icon-192.png'} 
                        alt={site.title} 
                        width={40} 
                        height={40} 
                        className="rounded object-contain bg-white/10 p-1" 
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{site.title}</h3>
                        <p className="text-sm text-blue-300">{site.category}</p>
                      </div>
                      {site.isNew && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">NEW</span>
                      )}
                    </div>
                    <p className="text-blue-200 mb-2">{site.description}</p>
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-yellow-400 text-sm hover:underline">
                      {site.url}
                    </a>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(site)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
