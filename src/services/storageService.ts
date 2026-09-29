import { SchemeConfig, ApplicationRecord, StudentDigitalCaseFile, GrievanceTicket, AuditLogEntry, UserRole } from '../types';
import { INITIAL_SCHEMES } from '../data/mockSchemes';
import { INITIAL_APPLICATIONS } from '../data/mockApplications';
import { MOCK_STUDENTS } from '../data/mockStudents';
import { INITIAL_GRIEVANCES, INITIAL_AUDIT_LOGS } from '../data/mockGrievances';

const STORAGE_KEYS = {
  SCHEMES: 'mota_schemes_v1',
  APPLICATIONS: 'mota_applications_v1',
  STUDENTS: 'mota_students_v1',
  GRIEVANCES: 'mota_grievances_v1',
  AUDIT_LOGS: 'mota_audit_logs_v1',
  ACTIVE_ROLE: 'mota_active_role_v1',
  CURRENT_STUDENT_ID: 'mota_active_student_id_v1'
};

export class StorageService {
  static getSchemes(): SchemeConfig[] {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEMES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(INITIAL_SCHEMES));
      return INITIAL_SCHEMES;
    }
    return JSON.parse(data);
  }

  static saveSchemes(schemes: SchemeConfig[]): void {
    localStorage.setItem(STORAGE_KEYS.SCHEMES, JSON.stringify(schemes));
  }

  static getApplications(): ApplicationRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    return JSON.parse(data);
  }

  static saveApplications(apps: ApplicationRecord[]): void {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
  }

  static getApplicationById(id: string): ApplicationRecord | undefined {
    const apps = this.getApplications();
    return apps.find(a => a.id === id);
  }

  static updateApplication(updatedApp: ApplicationRecord): void {
    const apps = this.getApplications();
    const index = apps.findIndex(a => a.id === updatedApp.id);
    if (index >= 0) {
      apps[index] = updatedApp;
    } else {
      apps.unshift(updatedApp);
    }
    this.saveApplications(apps);
  }

  static getStudents(): Record<string, StudentDigitalCaseFile> {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(MOCK_STUDENTS));
      return MOCK_STUDENTS;
    }
    return JSON.parse(data);
  }

  static getStudentById(motaId: string): StudentDigitalCaseFile | undefined {
    const students = this.getStudents();
    return students[motaId];
  }

  static saveStudent(student: StudentDigitalCaseFile): void {
    const students = this.getStudents();
    students[student.motaLifetimeId] = student;
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }

  static getGrievances(): GrievanceTicket[] {
    const data = localStorage.getItem(STORAGE_KEYS.GRIEVANCES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(INITIAL_GRIEVANCES));
      return INITIAL_GRIEVANCES;
    }
    return JSON.parse(data);
  }

  static saveGrievances(grievances: GrievanceTicket[]): void {
    localStorage.setItem(STORAGE_KEYS.GRIEVANCES, JSON.stringify(grievances));
  }

  static addGrievance(grievance: GrievanceTicket): void {
    const list = this.getGrievances();
    list.unshift(grievance);
    this.saveGrievances(list);
  }

  static getAuditLogs(): AuditLogEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    return JSON.parse(data);
  }

  static logActivity(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  }

  static getActiveRole(): UserRole {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole) || 'applicant';
  }

  static setActiveRole(role: UserRole): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  }

  static getCurrentStudentId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT_ID) || 'ST-CASE-2026-JH-88341';
  }

  static setCurrentStudentId(motaId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT_ID, motaId);
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.SCHEMES);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.GRIEVANCES);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT_ID);
  }
}
