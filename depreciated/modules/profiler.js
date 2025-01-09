export class Profiler {
    constructor() {
        this.profiles = new Map();
        this.activeProfiles = new Map();
    }

    startProfile(name) {
        const profile = {
            name,
            startTime: process.hrtime(),
            events: []
        };
        this.activeProfiles.set(name, profile);
    }

    addEvent(profileName, eventName) {
        const profile = this.activeProfiles.get(profileName);
        if (profile) {
            profile.events.push({
                name: eventName,
                timestamp: process.hrtime(profile.startTime)
            });
        }
    }

    endProfile(name) {
        const profile = this.activeProfiles.get(name);
        if (profile) {
            profile.duration = process.hrtime(profile.startTime);
            this.profiles.set(name, profile);
            this.activeProfiles.delete(name);
            return this.formatProfile(profile);
        }
    }

    formatProfile(profile) {
        return {
            name: profile.name,
            duration: this.formatHrTime(profile.duration),
            events: profile.events.map(event => ({
                name: event.name,
                timestamp: this.formatHrTime(event.timestamp)
            }))
        };
    }

    formatHrTime([seconds, nanoseconds]) {
        return seconds * 1000 + nanoseconds / 1000000;
    }
} 