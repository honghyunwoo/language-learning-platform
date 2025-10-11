/**
 * B2B Organization Management
 * 기업/교육기관 관리 시스템
 */

import { CEFRLevel } from '@/lib/types/activity';

// ===== 조직 타입 =====
export type OrganizationType = 'enterprise' | 'school' | 'academy' | 'government';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  industry?: string;
  size: 'small' | 'medium' | 'large' | 'enterprise'; // 직원 수 기준
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  billing: {
    companyRegistrationNumber: string;
    billingEmail: string;
    paymentMethod: 'invoice' | 'card' | 'wire_transfer';
  };
  subscription: {
    plan: 'enterprise';
    seats: number; // 라이선스 수
    usedSeats: number;
    startDate: Date;
    renewalDate: Date;
    autoRenew: boolean;
    customPricing?: number; // 협상된 가격
  };
  settings: {
    ssoEnabled: boolean;
    ssoProvider?: 'google' | 'azure' | 'okta' | 'custom';
    customDomain?: string;
    branding?: {
      logoUrl: string;
      primaryColor: string;
      secondaryColor: string;
    };
    features: {
      customCurriculum: boolean;
      advancedReporting: boolean;
      apiAccess: boolean;
      dedicatedSupport: boolean;
    };
  };
  admins: string[]; // User IDs
  createdAt: Date;
  updatedAt: Date;
}

// ===== 팀/부서 =====
export interface Team {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  managerIds: string[]; // User IDs
  memberIds: string[]; // User IDs
  targetLevel?: CEFRLevel;
  customCurriculum?: string; // Curriculum ID
  createdAt: Date;
  updatedAt: Date;
}

// ===== 학습자 초대 =====
export interface Invitation {
  id: string;
  organizationId: string;
  teamId?: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  invitedBy: string; // User ID
  status: 'pending' | 'accepted' | 'expired' | 'canceled';
  expiresAt: Date;
  createdAt: Date;
  acceptedAt?: Date;
}

// ===== 팀 진도 리포트 =====
export interface TeamProgressReport {
  teamId: string;
  teamName: string;
  period: {
    startDate: Date;
    endDate: Date;
  };
  members: {
    userId: string;
    userName: string;
    email: string;
    currentLevel: CEFRLevel;
    activitiesCompleted: number;
    hoursStudied: number;
    avgScore: number;
    lastActiveAt: Date;
    strengths: string[];
    weaknesses: string[];
  }[];
  summary: {
    totalMembers: number;
    activeMembers: number; // 주 1회 이상 활동
    avgCompletionRate: number;
    avgScore: number;
    totalHoursStudied: number;
    levelDistribution: Record<CEFRLevel, number>;
  };
  topPerformers: {
    userId: string;
    userName: string;
    score: number;
  }[];
  needsAttention: {
    userId: string;
    userName: string;
    reason: string;
  }[];
}

// ===== 커스텀 커리큘럼 =====
export interface CustomCurriculum {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  targetLevel: CEFRLevel;
  durationWeeks: number;
  createdBy: string; // User ID
  activities: {
    weekId: string;
    activityIds: string[];
    customContent?: {
      title: string;
      type: 'reading' | 'listening' | 'vocabulary' | 'grammar';
      content: string;
      exercises: unknown[]; // 커스텀 문제
    }[];
  }[];
  assignedTeams: string[]; // Team IDs
  createdAt: Date;
  updatedAt: Date;
}

// ===== 조직 생성 =====
export async function createOrganization(
  data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'subscription'>
): Promise<{ organization: Organization } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to create organization' };
    }

    const organization = await response.json();
    return { organization };
  } catch (error) {
    console.error('Error creating organization:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 팀 생성 =====
export async function createTeam(
  organizationId: string,
  data: Omit<Team, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>
): Promise<{ team: Team } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        ...data,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to create team' };
    }

    const team = await response.json();
    return { team };
  } catch (error) {
    console.error('Error creating team:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 학습자 초대 =====
export async function inviteMembers(
  organizationId: string,
  emails: string[],
  teamId?: string,
  role: 'admin' | 'manager' | 'member' = 'member'
): Promise<{ invitations: Invitation[] } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        emails,
        teamId,
        role,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to send invitations' };
    }

    const invitations = await response.json();
    return { invitations };
  } catch (error) {
    console.error('Error inviting members:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 팀 진도 리포트 조회 =====
export async function getTeamProgressReport(
  teamId: string,
  startDate: Date,
  endDate: Date
): Promise<{ report: TeamProgressReport } | { error: string }> {
  try {
    const params = new URLSearchParams({
      teamId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await fetch(`/api/b2b/reports/team?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to fetch report' };
    }

    const report = await response.json();
    return { report };
  } catch (error) {
    console.error('Error fetching team report:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 조직 전체 리포트 조회 =====
export async function getOrganizationReport(
  organizationId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  report: {
    organization: Organization;
    teams: TeamProgressReport[];
    summary: {
      totalSeats: number;
      usedSeats: number;
      totalMembers: number;
      activeMembers: number;
      totalHoursStudied: number;
      avgCompletionRate: number;
      avgScore: number;
      levelDistribution: Record<CEFRLevel, number>;
    };
  };
} | { error: string }> {
  try {
    const params = new URLSearchParams({
      organizationId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const response = await fetch(`/api/b2b/reports/organization?${params.toString()}`);

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to fetch report' };
    }

    const report = await response.json();
    return { report };
  } catch (error) {
    console.error('Error fetching organization report:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 커스텀 커리큘럼 생성 =====
export async function createCustomCurriculum(
  data: Omit<CustomCurriculum, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ curriculum: CustomCurriculum } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/curricula', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to create curriculum' };
    }

    const curriculum = await response.json();
    return { curriculum };
  } catch (error) {
    console.error('Error creating curriculum:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 라이선스 관리 =====
export function checkLicenseAvailability(organization: Organization): {
  available: boolean;
  remainingSeats: number;
  usedSeats: number;
  totalSeats: number;
} {
  const remainingSeats = organization.subscription.seats - organization.subscription.usedSeats;

  return {
    available: remainingSeats > 0,
    remainingSeats,
    usedSeats: organization.subscription.usedSeats,
    totalSeats: organization.subscription.seats,
  };
}

export async function addLicenseSeats(
  organizationId: string,
  additionalSeats: number
): Promise<{ success: boolean; newTotal: number } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/organizations/licenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        additionalSeats,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to add licenses' };
    }

    const data = await response.json();
    return { success: true, newTotal: data.totalSeats };
  } catch (error) {
    console.error('Error adding licenses:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== SSO 설정 =====
export async function configureSSOSettings(
  organizationId: string,
  settings: {
    enabled: boolean;
    provider?: 'google' | 'azure' | 'okta' | 'custom';
    config?: {
      domain?: string;
      clientId?: string;
      clientSecret?: string;
      metadataUrl?: string;
    };
  }
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/organizations/sso', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        ...settings,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to configure SSO' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error configuring SSO:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// ===== 데이터 내보내기 =====
export async function exportOrganizationData(
  organizationId: string,
  format: 'csv' | 'excel' | 'json'
): Promise<{ downloadUrl: string } | { error: string }> {
  try {
    const response = await fetch('/api/b2b/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        organizationId,
        format,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Failed to export data' };
    }

    const data = await response.json();
    return { downloadUrl: data.url };
  } catch (error) {
    console.error('Error exporting data:', error);
    return { error: 'An unexpected error occurred' };
  }
}
