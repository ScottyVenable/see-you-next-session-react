# System Outline: See You Next Session

## 1. Core Concept
"See You Next Session" is a clinical simulator and puzzle game where the player acts as a therapist. The goal is to conduct successful therapy sessions by observing patients, identifying key emotional triggers, and using appropriate clinical techniques to achieve breakthroughs.

## 2. Technical Stack
- **Frontend:** React 19, TypeScript, Vite.
- **Mobile Integration:** Capacitor (Android).
- **Engine Extension:** Godot 4.3 (Foundational integration for 2D/3D visuals).
- **State Management:** Custom React hooks and reducers for game state.
- **Persistence:** LocalStorage for progress and session data.

## 3. Key Systems

### A. Session System
- **Dialogue Tree:** Branching paths based on player responses.
- **Anxiety Meter:** Tracks the patient's emotional state. High anxiety may lead to session termination, while low anxiety might indicate lack of progress.
- **Turn Limit:** Each session is divided into blocks (e.g., 10-minute blocks) totaling a fixed session time.

### B. Observation System (Focus Mode)
- **Visual Cues:** Non-verbal behaviors (e.g., foot tapping, avoiding eye contact) that can only be seen in Focus Mode.
- **Focus Resource:** A limited resource spent to identify visual tokens.

### C. Token & Clipboard System
- **Keyword Tokens:** Identified from patient speech.
- **Visual Tokens:** Identified from patient behavior.
- **Synthesis:** Combining tokens on the clipboard to unlock special "Breakthrough" responses.

### D. Documentation System
- **Post-Session Report:** Players must document the session correctly to earn Knowledge Points.
- **Diagnosis:** Matching patient symptoms to clinical definitions in the Handbook.

### E. Progression & Upgrades
- **Knowledge Points (KP):** Currency earned from sessions.
- **Office Upgrades:** Visual and functional improvements to the therapist's office (e.g., new plants, better equipment, certifications).
- **Specializations:** Unlocking new clinical techniques or handling more complex patient cases.

## 4. Content Structure
- **Patients:** Authored characters with unique backstories, dialogue nodes, and visual cues.
- **Handbook:** A reference guide for the player detailing clinical techniques and diagnostic criteria.
- **Inbox:** A hub for receiving new referrals and managing correspondence.
