import React, { useState } from 'react';
import { Key, Copy, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface Client {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUris: string[];
  scopes: string[];
  createdAt: string;
}

export function ClientRegistration() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'School Management App',
      clientId: 'school-management-app',
      clientSecret: 'demo-client-secret-123456789',
      redirectUris: ['http://localhost:3000/auth/callback'],
      scopes: ['openid', 'profile', 'email'],
      createdAt: new Date().toISOString()
    }
  ]);
  
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    redirectUri: ''
  });

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const client: Client = {
        id: Math.random().toString(36).substr(2, 9),
        name: newClient.name,
        clientId: `client_${Math.random().toString(36).substr(2, 16)}`,
        clientSecret: `secret_${Math.random().toString(36).substr(2, 32)}`,
        redirectUris: [newClient.redirectUri],
        scopes: ['openid', 'profile', 'email'],
        createdAt: new Date().toISOString()
      };

      setClients([...clients, client]);
      setNewClient({ name: '', redirectUri: '' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      setClients(clients.filter(c => c.id !== clientId));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const toggleSecretVisibility = (clientId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
    }));
  };

  return (
    <div className="space-y-6">
      <Card title="OAuth2 Client Registration" className="p-6">
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Register applications that can integrate with the Identity Provider. 
            Each client receives a unique Client ID and Secret for OAuth2 authentication.
          </p>
        </div>

        <form onSubmit={handleCreateClient} className="space-y-4 mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Client</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Name
              </label>
              <Input
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="My Application"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Redirect URI
              </label>
              <Input
                value={newClient.redirectUri}
                onChange={(e) => setNewClient({ ...newClient, redirectUri: e.target.value })}
                placeholder="http://localhost:3000/auth/callback"
                required
              />
            </div>
          </div>

          <Button type="submit" isLoading={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Create Client
          </Button>
        </form>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Registered Clients</h3>
          
          {clients.map((client) => (
            <div key={client.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">{client.name}</h4>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(client.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteClient(client.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {client.clientId}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(client.clientId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret
                  </label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                      {showSecrets[client.id] 
                        ? client.clientSecret 
                        : '••••••••••••••••••••••••••••••••'
                      }
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSecretVisibility(client.id)}
                    >
                      {showSecrets[client.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(client.clientSecret)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URIs
                </label>
                <div className="space-y-1">
                  {client.redirectUris.map((uri, index) => (
                    <code key={index} className="block bg-gray-100 px-3 py-2 rounded text-sm">
                      {uri}
                    </code>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scopes
                </label>
                <div className="flex flex-wrap gap-2">
                  {client.scopes.map((scope) => (
                    <span
                      key={scope}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <Key className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Store your Client Secret securely. It should never be exposed in client-side code or public repositories. 
                Use environment variables or secure configuration management in production.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
