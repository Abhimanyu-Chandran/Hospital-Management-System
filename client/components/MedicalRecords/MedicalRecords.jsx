import React, { useState, useMemo } from 'react'
import { Plus, Search, FileText, Eye, Download } from 'lucide-react'

const MedicalRecords = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Medical record data with updated types
  const allRecords = [
    {
      id: 1,
      patientName: 'Emily Davis',
      patientId: '#3',
      recordType: 'Surgery Report',
      date: '4/22/2026',
      doctor: 'Dr. John Brown',
      diagnosis: 'ACL Reconstruction',
      notes: 'Successful surgery. Patient in recovery. Physical therapy scheduled.'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      patientId: '#2',
      recordType: 'Prescription',
      date: '4/20/2026',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension',
      notes: 'Blood pressure medication prescribed. Follow-up in 2 weeks.'
    },
    {
      id: 3,
      patientName: 'James Wilson',
      patientId: '#4',
      recordType: 'Imaging',
      date: '4/18/2026',
      doctor: 'Dr. Robert Smith',
      diagnosis: 'Chest X-Ray',
      notes: 'Clear lungs. No abnormalities detected. Routine check-up completed.'
    },
    {
      id: 4,
      patientName: 'Maria Garcia',
      patientId: '#5',
      recordType: 'Consultation',
      date: '4/15/2026',
      doctor: 'Dr. Lisa Williams',
      diagnosis: 'Annual Check-up',
      notes: 'Patient in good health. Routine vaccinations updated. Next visit in 6 months.'
    },
    {
      id: 5,
      patientName: 'David Lee',
      patientId: '#1',
      recordType: 'Lab Results',
      date: '4/10/2026',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Blood Work',
      notes: 'Cholesterol levels normal. Vitamin D deficiency detected. Supplements recommended.'
    }
  ];

  // Filter records based on search query and type
  const filteredRecords = useMemo(() => {
    let filtered = allRecords;

    // Filter by type
    if (filterType !== 'All') {
      filtered = filtered.filter(record =>
        record.recordType === filterType
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(record =>
        record.patientName.toLowerCase().includes(query) ||
        record.doctor.toLowerCase().includes(query) ||
        record.diagnosis.toLowerCase().includes(query) ||
        record.recordType.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filterType]);

  // Get record type color with new types
  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'Surgery Report': return 'bg-purple-100 text-purple-800';
      case 'Prescription': return 'bg-orange-100 text-orange-800';
      case 'Imaging': return 'bg-pink-100 text-pink-800';
      case 'Consultation': return 'bg-blue-100 text-blue-800';
      case 'Lab Results': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className='pt-5 p-2'>
      <div className='flex items-center justify-between shadow-md rounded-md p-3'>
        <div>
          <p className='text-2xl'>Medical Records</p>
          <p>Manage patient medical records and documents</p>
        </div>
        <div className='flex'>
          <button className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'>
            <Plus className='w-4 h-6' />
            &nbsp;
            New Record
          </button>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg shadow p-5 my-5'>
        {/* Search Bar */}
        <div className='relative mb-6'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search by patient name, diagnosis, or doctor...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className='mb-6'>
          <label className='text-sm font-medium text-gray-700 mb-2 block'>Filter by type:</label>
          <div className='flex space-x-2'>
            {['All', 'Consultation', 'Lab Results', 'Surgery Report', 'Prescription', 'Imaging'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${filterType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Medical Record Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => (
              <div key={record.id} className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
                {/* Header Section */}
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center'>
                    <FileText className='w-5 h-5 text-gray-500 mr-3' />
                    <div>
                      <h3 className='font-semibold text-gray-900'>{record.patientName}</h3>
                      <p className='text-sm text-gray-500'>Patient ID: {record.patientId}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecordTypeColor(record.recordType)}`}>
                      {record.recordType}
                    </span>
                    <p className='text-sm text-gray-500 mt-1'>{record.date}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className='space-y-3 mb-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Doctor:</span>
                    <span className='ml-2'>{record.doctor}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Diagnosis:</span>
                    <span className='ml-2'>{record.diagnosis}</span>
                  </div>
                  <div className='text-sm text-gray-600'>
                    <span className='font-medium'>Notes:</span>
                    <p className='mt-1 text-gray-700'>{record.notes}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex space-x-3'>
                  <button className='flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center'>
                    <Eye className='w-4 h-4 mr-2' />
                    View Full Record
                  </button>
                  <button className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center'>
                    <Download className='w-4 h-4 mr-2' />
                    Download PDF
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-8 text-gray-500'>
              No medical records found matching your criteria
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default MedicalRecords