# GSAC Frontend → Spring Boot API Mapping

## Base URL
All endpoints are prefixed: `https://api.gsac.org/api/v1`

---

## Authentication

| Frontend Action | HTTP | Endpoint | Request Body | Response |
|---|---|---|---|---|
| Login (`/login` page) | `POST` | `/auth/login` | `{ email, password }` | `{ token, user: { id, name, email, role } }` |
| Logout | `POST` | `/auth/logout` | — (Bearer token) | `204 No Content` |
| Get current user | `GET` | `/auth/me` | — (Bearer token) | `{ id, name, email, role }` |

**Frontend hook**: `useSite()` → `user`, `logout()`
**Spring Security**: JWT via `Authorization: Bearer <token>` header

---

## Courses

| Frontend Page/Action | HTTP | Endpoint | Query Params | Notes |
|---|---|---|---|---|
| Home — featured courses | `GET` | `/courses` | `?featured=true&published=true` | |
| Training Calendar | `GET` | `/courses` | `?published=true&sort=nextDate` | |
| Training Categories listing | `GET` | `/courses` | `?categorySlug=<slug>&published=true` | |
| Search courses | `GET` | `/courses` | `?search=<q>&published=true` | |
| Course detail page | `GET` | `/courses/{slug}` | — | |
| Admin — list all | `GET` | `/courses` | `?page=0&size=50` | Admin only |
| Admin — create course | `POST` | `/courses` | `CourseDTO body` | Admin only |
| Admin — update course | `PUT` | `/courses/{id}` | `CourseDTO body` | Admin only |
| Admin — delete course | `DELETE` | `/courses/{id}` | — | Admin only |

**CourseDTO fields**: `title, slug, categoryId, duration, format, level, price, featured, published, description, location, nextDate, outcomes[]`

---

## Categories

| Frontend Page/Action | HTTP | Endpoint | Notes |
|---|---|---|---|
| Training Categories page | `GET` | `/categories` | `?published=true` |
| Category detail | `GET` | `/categories/{slug}` | Includes subcategories |
| Admin CRUD | `GET/POST/PUT/DELETE` | `/categories` / `/categories/{id}` | Admin only |

---

## Venues

| Frontend Page/Action | HTTP | Endpoint | Notes |
|---|---|---|---|
| Training Venues page | `GET` | `/venues` | |
| Admin CRUD | `GET/POST/PUT/DELETE` | `/venues` / `/venues/{id}` | Admin only |

---

## Enrollments

| Frontend Page/Action | HTTP | Endpoint | Request Body | Notes |
|---|---|---|---|---|
| Enroll page form submit | `POST` | `/enrollments` | `{ courseId, name, email, phone, organization, format, message }` | Public |
| Admin — list all enrollments | `GET` | `/enrollments` | — | `?status=Confirmed&page=0` |
| Admin — update status | `PATCH` | `/enrollments/{id}/status` | `{ status: "Confirmed" }` | Admin only |
| Admin — delete enrollment | `DELETE` | `/enrollments/{id}` | — | Admin only |

---

## Blog Posts

| Frontend Page/Action | HTTP | Endpoint | Notes |
|---|---|---|---|
| Blog listing | `GET` | `/blog` | `?published=true&page=0&size=12` |
| Blog post detail | `GET` | `/blog/{slug}` | |
| Admin CRUD | `GET/POST/PUT/DELETE` | `/blog` / `/blog/{id}` | Admin only |

---

## FAQs

| Frontend Page/Action | HTTP | Endpoint | Notes |
|---|---|---|---|
| FAQs page | `GET` | `/faqs` | |
| Admin CRUD | `GET/POST/PUT/DELETE` | `/faqs` / `/faqs/{id}` | Admin only |

---

## Testimonials

| Frontend Page/Action | HTTP | Endpoint | Notes |
|---|---|---|---|
| Home — testimonials | `GET` | `/testimonials` | `?approved=true` |
| Admin CRUD | `GET/POST/PUT/DELETE` | `/testimonials` / `/testimonials/{id}` | Admin only |

---

## Partners / Logos

| Frontend Page/Action | HTTP | Endpoint | Notes |
|---|---|---|---|
| Home — partner marquee | `GET` | `/partners` | |
| Admin CRUD | `GET/POST/PUT/DELETE` | `/partners` / `/partners/{id}` | Admin only |

---

## Site Content / Stats

| Frontend Page/Action | HTTP | Endpoint | Request Body | Notes |
|---|---|---|---|---|
| Global site config (phone, socials, hero) | `GET` | `/site-content` | — | Cached |
| Admin — update site content | `PUT` | `/site-content` | `SiteContentDTO` | Admin only |
| Stats (hero numbers) | `GET` | `/stats` | — | |
| Admin — update stats | `PUT` | `/stats` | `StatsDTO` | Admin only |

---

## Contact Form

| Frontend Page/Action | HTTP | Endpoint | Request Body |
|---|---|---|---|
| Contact page submit | `POST` | `/contact` | `{ name, email, phone, subject, message }` |
| Trainer recruitment form | `POST` | `/trainer-applications` | `{ name, email, phone, specialization, experience, cv_url }` |

---

## Spring Boot Implementation Notes

### Project Structure
```
src/main/java/com/gsac/
  ├── config/
  │   ├── SecurityConfig.java       # JWT filter, CORS, role guards
  │   └── CorsConfig.java           # Allow http://localhost:5173 in dev
  ├── controller/
  │   ├── CourseController.java
  │   ├── CategoryController.java
  │   ├── EnrollmentController.java
  │   ├── AuthController.java
  │   └── ... (one per resource)
  ├── service/
  ├── repository/
  ├── model/
  └── dto/
```

### CORS for React Dev Server
```java
@Configuration
public class CorsConfig {
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:5173", "https://gsac.org"));
    config.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    return new UrlBasedCorsConfigurationSource().apply(config);
  }
}
```

### JWT Role Guard
```java
@PreAuthorize("hasRole('ADMIN')")  // on admin-only endpoints
```

### Frontend API Integration Pattern
Replace `useSite()` mock data with Axios/fetch calls:
```js
// src/api/courses.js
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
const token = () => localStorage.getItem('fe_token')

export const getCourses = (params) =>
  fetch(`${API}/courses?${new URLSearchParams(params)}`, {
    headers: { Authorization: `Bearer ${token()}` }
  }).then(r => r.json())

export const createCourse = (data) =>
  fetch(`${API}/courses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
    body: JSON.stringify(data)
  }).then(r => r.json())
```
