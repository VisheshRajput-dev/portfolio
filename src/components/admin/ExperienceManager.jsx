import React, { useState } from 'react';
import { addExperience, updateExperience, deleteExperience } from '../../firebase/database';

const ExperienceManager = ({ experiences, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
    technologies: '',
    location: 'Remote',
    highlights: '',
    current: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const experienceData = {
      ...formData,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      highlights: formData.highlights.split('\n').filter(h => h.trim()).map(h => h.trim()),
      startDate: new Date(formData.startDate),
      endDate: formData.current ? null : new Date(formData.endDate)
    };

    try {
      if (editingExperience) {
        await updateExperience(editingExperience.id, experienceData);
      } else {
        await addExperience(experienceData);
      }
      
      setShowForm(false);
      setEditingExperience(null);
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
        technologies: '',
        location: 'Remote',
        highlights: '',
        current: false
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleEdit = (experience) => {
    setEditingExperience(experience);
    setFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate?.toDate?.()?.toISOString().split('T')[0] || '',
      endDate: experience.endDate?.toDate?.()?.toISOString().split('T')[0] || '',
      description: experience.description,
      technologies: experience.technologies?.join(', ') || '',
      location: experience.location || 'Remote',
      highlights: experience.highlights?.join('\n') || '',
      current: !experience.endDate
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await deleteExperience(id);
        onUpdate();
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Experience Timeline</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
        >
          Add Experience
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    disabled={formData.current}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Remote, New York, etc."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="current"
                  checked={formData.current}
                  onChange={(e) => setFormData({...formData, current: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
                  className="mr-2"
                />
                <label htmlFor="current" className="text-gray-300">Currently working here</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                  placeholder="React, Node.js, MongoDB, etc."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Highlights (one per line)</label>
                <textarea
                  value={formData.highlights}
                  onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                  rows={4}
                  placeholder="Delivered 3+ projects for clients within 2-week timelines&#10;Implemented full-stack systems with authentication&#10;Used AI tools to boost development speed by 40%"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-400 hover:to-pink-400 transition-all duration-300"
                >
                  {editingExperience ? 'Update Experience' : 'Add Experience'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingExperience(null);
                    setFormData({
                      company: '',
                      position: '',
                      startDate: '',
                      endDate: '',
                      description: '',
                      technologies: '',
                      current: false
                    });
                  }}
                  className="flex-1 bg-gray-500/20 border border-gray-500/30 text-gray-300 py-3 rounded-lg hover:bg-gray-500/30 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experiences List */}
      <div className="space-y-4">
        {experiences.map((experience, index) => (
          <div
            key={experience.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{experience.position}</h3>
                <p className="text-purple-300 font-medium">{experience.company}</p>
                <p className="text-gray-300 text-sm">
                  {experience.startDate?.toDate?.()?.toLocaleDateString()} - {experience.endDate ? experience.endDate.toDate?.()?.toLocaleDateString() : 'Present'}
                </p>
                <p className="text-gray-300 mt-2">{experience.description}</p>
                
                {experience.highlights && experience.highlights.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-purple-300 mb-2">Key Highlights:</h5>
                    <ul className="space-y-1">
                      {experience.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start">
                          <span className="text-purple-400 mr-2">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {experience.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {experience.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(experience)}
                  className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-2 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(experience.id)}
                  className="bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceManager;
