"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectCategory = exports.ProjectStatus = exports.EventCategory = exports.AnnouncementType = exports.UserRole = void 0;
// src/types/enums.ts
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "student";
    UserRole["ORGANIZER"] = "organizer";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var AnnouncementType;
(function (AnnouncementType) {
    AnnouncementType["HOLIDAY"] = "holiday";
    AnnouncementType["DUTY_LEAVE"] = "duty-leave";
    AnnouncementType["EXCLUSIVE"] = "exclusive";
})(AnnouncementType || (exports.AnnouncementType = AnnouncementType = {}));
var EventCategory;
(function (EventCategory) {
    EventCategory["HACKATHON"] = "hackathon";
    EventCategory["WORKSHOP"] = "workshop";
    EventCategory["SEMINAR"] = "seminar";
    EventCategory["CULTURAL"] = "cultural";
})(EventCategory || (exports.EventCategory = EventCategory = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["DRAFT"] = "draft";
    ProjectStatus["PUBLISHED"] = "published";
    ProjectStatus["ONGOING"] = "ongoing";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["CANCELLED"] = "cancelled";
    ProjectStatus["ARCHIVED"] = "archived";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
var ProjectCategory;
(function (ProjectCategory) {
    ProjectCategory["HACKATHON"] = "hackathon";
    ProjectCategory["WORKSHOP"] = "workshop";
    ProjectCategory["SEMINAR"] = "seminar";
    ProjectCategory["CONFERENCE"] = "conference";
    ProjectCategory["COMPETITION"] = "competition";
    ProjectCategory["TRAINING"] = "training";
    ProjectCategory["RESEARCH"] = "research";
    ProjectCategory["COMMUNITY"] = "community";
    ProjectCategory["OTHER"] = "other";
})(ProjectCategory || (exports.ProjectCategory = ProjectCategory = {}));
//# sourceMappingURL=enums.js.map