// src/types/enums.ts
export enum UserRole {
    STUDENT = "student",
    ORGANIZER = "organizer",
    ADMIN = "admin",
  }
  
  export enum AnnouncementType {
    HOLIDAY = "holiday",
    DUTY_LEAVE = "duty-leave",
    ACADEMIC = "academic",
    UPCOMING_EVENT = "upcoming-event",
    PLACEMENT = "placement",
    EXCLUSIVE = "exclusive",
  }
  
  export enum EventCategory {
    HACKATHON = "hackathon",
    WORKSHOP = "workshop",
    SEMINAR = "seminar",
    CULTURAL = "cultural",
  }

  export enum ProjectStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    ARCHIVED = "archived"
  }

  export enum ProjectCategory {
    HACKATHON = "hackathon",
    WORKSHOP = "workshop",
    SEMINAR = "seminar",
    CONFERENCE = "conference",
    COMPETITION = "competition",
    TRAINING = "training",
    RESEARCH = "research",
    COMMUNITY = "community",
    OTHER = "other"
  }

  export enum TicketType {
    VIP = "VIP",
    GENERAL = "General",
    STUDENT = "Student",
    EARLY_BIRD = "Early Bird",
    GROUP = "Group",
    CORPORATE = "Corporate",
    FREE = "Free",
    PREMIUM = "Premium",
    STANDARD = "Standard",
    BASIC = "Basic"
  }
  