import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import { Search, UserPlus, Frown, User, Mail, ChevronDown, MoreVertical } from 'lucide-react';

import { Link } from 'react-router-dom';

const UsersPage: React.FC = () => {
  // const { users, loading } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //                        user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesRole = roleFilter === 'all' || user.role === roleFilter;
  //   return matchesSearch && matchesRole;
  // });

  const roles = ['all', 'admin', 'user', 'editor'];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              User Management
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <User className="h-5 w-5 mr-2 text-blue-500" />
              <p>Manage all registered users and their permissions</p>
            </div>
          </div>
          <div>
            <Link to="/users/new">
              <Button icon={<UserPlus className="h-4 w-4" />} variant="primary">
                Add User
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        {/* <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Dropdown 
              options={roles} 
              selectedOption={roleFilter}
              onSelect={setRoleFilter}
              displayTransform={(role) => role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
              buttonIcon={<ChevronDown className="ml-2 h-4 w-4" />}
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
            </span>
          </div>
        </div> */}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 text-sm">
            <div className="col-span-4 md:col-span-3">User</div>
            <div className="col-span-4 md:col-span-3">Email</div>
            <div className="col-span-2 md:col-span-2">Role</div>
            <div className="col-span-2 md:col-span-3">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Frown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700">No users found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="col-span-4 md:col-span-3 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-900 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <Badge 
                      variant={
                        user.role === 'admin' ? 'primary' : 
                        user.role === 'editor' ? 'secondary' : 'default'
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <Badge variant={user.active ? 'success' : 'warning'}>
                      {user.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Dropdown 
                      trigger={
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      }
                      options={['Edit', user.active ? 'Deactivate' : 'Activate', 'Delete']}
                      onSelect={(option) => console.log(option, user.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> users
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default UsersPage;