# துணைவன் · Thunaivan
### *"The One Who Stands By You — From School to College"*

> A full-stack MERN mentorship platform connecting Tamil Nadu rural school students with college mentors who share the same background, language, and district — guiding them from school life all the way to college admission.

---

## 🌟 About the Project

Thunaivan was built from a real personal experience. Many students from Tamil medium, State Board backgrounds in Tamil Nadu reach college without any prior guidance — no one to tell them which group to choose in 11th, how to prepare for entrance exams, or what college life looks like.

Thunaivan bridges this gap by creating a **safe, trusted, and free mentorship network** where college students guide school students from their own background.

---

## ✨ Features

### 👥 Three User Roles
- **School Student** — Gets a personal college mentor, posts subject doubts, tracks progress
- **College Mentor** — Guides assigned students, answers doubts, schedules sessions
- **Admin** — Manages schools, colleges, students, mentors, and sends platform messages

### 🔐 Safe Registration System
- Unique **School Code** (from Headmaster) for student registration
- Unique **College Code** (from Dean) + **HOD Approval Document upload** for mentor registration
- Auto-approval — no manual verification needed for thousands of users

### 🤝 Smart Mentor Assignment
- Auto-assigns mentor based on **career interest** (Engineering, Medicine, Arts, etc.)
- Fallback: assigns any available mentor if no exact match found
- Admin can **manually assign** mentor if needed
- Maximum **5 students per mentor**

### 💬 WhatsApp-Style Chat
- Real-time chat between assigned student and mentor
- Messages auto-refresh every 5 seconds
- Read receipts (single tick ✓ sent, double tick ✓✓ read)
- Date separators for conversation history

### 📅 Session Management
- Student requests session → Mentor confirms date, time and Google Meet link
- Minimum **2 sessions per month** per student
- Session status: Pending → Scheduled → Completed / Missed
- **Warning system**: Yellow (1 missed) → Red (2 missed) → Auto-reassign (4 missed)
- Completed sessions show date, time and mentor notes only

### 📚 Open Doubt Forum
- Students post subject doubts (Tamil, Maths, Science, etc.)
- Any mentor can answer
- Answers visible to all students

### 📊 Progress Tracking
- Journey milestones from "Joined Thunaivan" to "Successfully joined college!"
- Monthly session count tracking
- Doubt statistics (total, answered, pending)

### ✉️ Admin Messaging
- Admin can send messages to Everyone, All Students, All Mentors, or a Specific person
- Messages appear on student and mentor dashboards

### 🌐 Bilingual Support
- Tamil and English throughout the platform

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT + bcryptjs |
| File Upload | Multer |
| Video Sessions | Google Meet (link sharing) |
| Deployment | Netlify (frontend) + Render (backend) |
| Version Control | Git + GitHub |

---

## 📁 Project Structure


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or above)
- MongoDB Atlas account (free tier)
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/rubigarajarajan/thunaivan.git
cd thunaivan
```

**2. Setup Backend**
```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

Start the backend:
```bash
npm run dev
```

**3. Setup Frontend**
```bash
cd ../frontend
npm install
npm start
```

**4. Open your browser**

---

## 🔑 How to Use

### Admin Setup (First Time)
1. Go to `http://localhost:3000/admin-login`
2. Password: `Thunaivan@Admin2026`
3. Add a School → get School Code
4. Add a College → get College Code

### Mentor Registration
1. Go to Register as Mentor
2. Enter College Code (from Admin)
3. Upload HOD Approval Document
4. Fill in guidance field and your story

### Student Registration
1. Go to Register as Student
2. Enter School Code (from Admin)
3. Select career interest
4. Mentor will be auto-assigned!

---

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with register options |
| Student Register | `/student-register` | School student registration |
| Mentor Register | `/mentor-register` | College mentor registration |
| Login | `/login` | Student and Mentor login |
| Student Dashboard | `/student-dashboard` | Home, doubts, sessions, progress |
| Mentor Dashboard | `/mentor-dashboard` | Students, doubts, sessions |
| Chat | `/chat` | Student-Mentor WhatsApp chat |
| Admin Login | `/admin-login` | Admin password login |
| Admin Dashboard | `/admin` | Full admin control panel |

---

## 💛 Why Thunaivan?

**துணைவன்** means *"The one who stands by you"* in Tamil.

This project was built from personal experience — transitioning from a Tamil medium State Board background to an English medium engineering college at CEG (College of Engineering Guindy, Chennai) with no prior computer knowledge. The struggles of that journey — the language barrier, the inferiority complex, not knowing what to expect — inspired this platform.

Thunaivan is not just a mini project. It is a platform built so that no Tamil Nadu rural student has to feel lost and alone when entering college life.

---

## 👩‍💻 Developer

**Rubiga PR**
B.E. Computer Science and Engineering — Second Year
College of Engineering Guindy, Anna University, Chennai

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

*Built with 💛 for Tamil Nadu rural students*

