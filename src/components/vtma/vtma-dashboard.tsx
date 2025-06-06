'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Thermometer,
  Brain,
  Heart,
  Eye,
  Camera,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  reportsGenerated: number;
  avgProcessingTime: number;
  aiAccuracy: number;
  weeklyTrend: number;
}

interface RecentActivity {
  id: string;
  type: 'upload' | 'report' | 'analysis';
  patient: string;
  timestamp: Date;
  status: 'completed' | 'processing' | 'pending';
}

export function VTMADashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    reportsGenerated: 0,
    avgProcessingTime: 0,
    aiAccuracy: 0,
    weeklyTrend: 0
  });

  const [recentActivity] = useState<RecentActivity[]>([]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Camera className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      case 'analysis': return <Brain className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Voltooid
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            Verwerking
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Wachtend
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min geleden`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} uur geleden`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} dag${days > 1 ? 'en' : ''} geleden`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welkom bij VTMA</h2>
            <p className="text-blue-100">
              Veterinaire Thermografie Medische Administratie - Verminder uw werkdruk met AI
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Thermometer className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Patiënten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Geen patiënten geregistreerd
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rapporten Gegenereerd</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Nog geen rapporten gegenereerd
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gem. Verwerkingstijd</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Geen verwerkingsdata beschikbaar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Nauwkeurigheid</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Nog geen AI analyses uitgevoerd
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Snelle Acties</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Start met het uploaden van thermografische beelden en registreren van patiëntgegevens.
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <Camera className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-xs font-medium text-blue-900">Upload Beelden</p>
                <p className="text-xs text-blue-700">Thermografische foto's</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-xs font-medium text-green-900">Patiënt Data</p>
                <p className="text-xs text-green-700">Registreer gegevens</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <Brain className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-xs font-medium text-purple-900">AI Analyse</p>
                <p className="text-xs text-purple-700">Automatische diagnose</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <FileText className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-xs font-medium text-orange-900">Rapport</p>
                <p className="text-xs text-orange-700">Gestandaardiseerd</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recente Activiteit</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Nog Geen Activiteit</h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Activiteiten zoals uploads, analyses en rapporten worden hier weergegeven zodra u begint.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Systeem Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Engine</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operationeel
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Beeld Verwerking</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operationeel
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Rapport Generatie</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operationeel
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Operationeel
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tips & Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Thermografie Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                <strong>Optimale Beeldkwaliteit:</strong> Zorg voor 15-30 minuten acclimatisatie in een tocht-vrije omgeving.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
              <p className="text-sm text-green-800">
                <strong>Camera Instellingen:</strong> Gebruik emissiviteit 0.98 voor dierenhuid en houdt 1.5m afstand aan.
              </p>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
              <p className="text-sm text-orange-800">
                <strong>Interpretatie:</strong> Temperatuurverschillen ≥1°C tussen links/rechts zijn significant.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}