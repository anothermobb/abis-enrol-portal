import React, { useState, useMemo } from 'react';
import { Search, Calendar, RefreshCw, AlertTriangle, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface CardRenewalData {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  avatar?: string;
  currentCardExpiry: Date;
  renewalStatus: 'expired' | 'expiring' | 'active' | 'renewed' | 'pending';
  lastRenewalDate?: Date;
  renewalHistory: Array<{
    date: Date;
    type: 'initial' | 'renewal';
    expiryDate: Date;
  }>;
  accessLevel: string;
}

// Mock data for card renewals
const mockCardData: CardRenewalData[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Sarah Johnson',
    department: 'Human Resources',
    position: 'HR Manager',
    avatar: '/api/placeholder/32/32',
    currentCardExpiry: new Date('2024-01-15'),
    renewalStatus: 'expired',
    lastRenewalDate: new Date('2023-01-15'),
    renewalHistory: [
      { date: new Date('2023-01-15'), type: 'renewal', expiryDate: new Date('2024-01-15') },
      { date: new Date('2022-01-15'), type: 'initial', expiryDate: new Date('2023-01-15') }
    ],
    accessLevel: 'Level 3'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Michael Chen',
    department: 'IT Department',
    position: 'Software Engineer',
    currentCardExpiry: new Date('2024-12-30'),
    renewalStatus: 'expiring',
    lastRenewalDate: new Date('2023-12-30'),
    renewalHistory: [
      { date: new Date('2023-12-30'), type: 'renewal', expiryDate: new Date('2024-12-30') }
    ],
    accessLevel: 'Level 2'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Emily Rodriguez',
    department: 'Marketing',
    position: 'Marketing Coordinator',
    currentCardExpiry: new Date('2025-06-15'),
    renewalStatus: 'active',
    lastRenewalDate: new Date('2024-06-15'),
    renewalHistory: [
      { date: new Date('2024-06-15'), type: 'renewal', expiryDate: new Date('2025-06-15') }
    ],
    accessLevel: 'Level 1'
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'David Kim',
    department: 'Finance',
    position: 'Senior Accountant',
    currentCardExpiry: new Date('2024-11-20'),
    renewalStatus: 'expiring',
    renewalHistory: [],
    accessLevel: 'Level 2'
  }
];

const CardRenewal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [cardData, setCardData] = useState<CardRenewalData[]>(mockCardData);

  // Calculate renewal urgency
  const getUrgencyLevel = (expiryDate: Date): 'expired' | 'critical' | 'warning' | 'normal' => {
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'critical';
    if (daysUntilExpiry <= 30) return 'warning';
    return 'normal';
  };

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = cardData.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || card.renewalStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort by urgency
    return filtered.sort((a, b) => {
      const urgencyOrder = { expired: 0, critical: 1, warning: 2, normal: 3 };
      const aUrgency = getUrgencyLevel(a.currentCardExpiry);
      const bUrgency = getUrgencyLevel(b.currentCardExpiry);
      return urgencyOrder[aUrgency] - urgencyOrder[bUrgency];
    });
  }, [cardData, searchTerm, statusFilter]);

  // Status badge styling
  const getStatusBadge = (status: string, expiryDate: Date) => {
    const urgency = getUrgencyLevel(expiryDate);
    
    switch (urgency) {
      case 'expired':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Expired
        </Badge>;
      case 'critical':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Expires Soon
        </Badge>;
      case 'warning':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
          <Clock className="h-3 w-3" />
          Expiring
        </Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>;
    }
  };

  // Handle individual card renewal
  const handleRenewalAction = (cardId: string, action: 'renew' | 'extend' | 'view-history') => {
    const card = cardData.find(c => c.id === cardId);
    if (!card) return;

    switch (action) {
      case 'renew':
        setCardData(prev => prev.map(c => 
          c.id === cardId 
            ? {
                ...c,
                renewalStatus: 'renewed' as const,
                lastRenewalDate: new Date(),
                currentCardExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
                renewalHistory: [
                  ...c.renewalHistory,
                  {
                    date: new Date(),
                    type: 'renewal' as const,
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                  }
                ]
              }
            : c
        ));
        toast({
          title: "Card Renewed",
          description: `${card.name}'s access card has been renewed for 1 year.`,
        });
        break;
      
      case 'extend':
        setCardData(prev => prev.map(c => 
          c.id === cardId 
            ? {
                ...c,
                currentCardExpiry: new Date(c.currentCardExpiry.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days extension
              }
            : c
        ));
        toast({
          title: "Card Extended",
          description: `${card.name}'s card expiry extended by 90 days.`,
        });
        break;

      case 'view-history':
        toast({
          title: "Renewal History",
          description: `Viewing renewal history for ${card.name}`,
        });
        break;
    }
  };

  // Handle bulk renewal
  const handleBulkRenewal = () => {
    if (selectedCards.length === 0) {
      toast({
        title: "No cards selected",
        description: "Please select cards to renew.",
        variant: "destructive"
      });
      return;
    }

    setCardData(prev => prev.map(card => 
      selectedCards.includes(card.id)
        ? {
            ...card,
            renewalStatus: 'renewed' as const,
            lastRenewalDate: new Date(),
            currentCardExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            renewalHistory: [
              ...card.renewalHistory,
              {
                date: new Date(),
                type: 'renewal' as const,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }
            ]
          }
        : card
    ));

    toast({
      title: "Bulk Renewal Complete",
      description: `${selectedCards.length} cards have been renewed.`,
    });

    setSelectedCards([]);
  };

  // Toggle card selection
  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  // Select all filtered cards
  const toggleSelectAll = () => {
    const allFilteredIds = filteredCards.map(card => card.id);
    setSelectedCards(prev => 
      prev.length === allFilteredIds.length ? [] : allFilteredIds
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Card Renewal Management</h1>
        <p className="text-muted-foreground">
          Manage access card renewals and track expiration dates
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 items-center max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="expiring">Expiring</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="renewed">Renewed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleBulkRenewal}
            disabled={selectedCards.length === 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Renew Selected ({selectedCards.length})
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredCards.filter(c => getUrgencyLevel(c.currentCardExpiry) === 'expired').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredCards.filter(c => ['critical', 'warning'].includes(getUrgencyLevel(c.currentCardExpiry))).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredCards.filter(c => getUrgencyLevel(c.currentCardExpiry) === 'normal').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Cards</p>
                <p className="text-2xl font-bold">{filteredCards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Access Cards</CardTitle>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedCards.length === filteredCards.length && filteredCards.length > 0}
                onCheckedChange={toggleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCards.map((card) => (
              <div 
                key={card.id} 
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedCards.includes(card.id)}
                  onCheckedChange={() => toggleCardSelection(card.id)}
                />
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src={card.avatar} alt={card.name} />
                  <AvatarFallback>{card.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold">{card.name}</h3>
                    <p className="text-sm text-muted-foreground">{card.employeeId}</p>
                    <p className="text-sm text-muted-foreground">{card.department}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Expires: {card.currentCardExpiry.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Access Level: {card.accessLevel}
                    </div>
                    {getStatusBadge(card.renewalStatus, card.currentCardExpiry)}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button 
                      size="sm" 
                      onClick={() => handleRenewalAction(card.id, 'renew')}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Renew
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRenewalAction(card.id, 'extend')}
                    >
                      Extend
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleRenewalAction(card.id, 'view-history')}
                    >
                      <FileText className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No cards found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardRenewal;