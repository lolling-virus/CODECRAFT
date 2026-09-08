-- ========================================================================
-- SETU HEALTH - RURAL CARE PATHWAY PLATFORM
-- Supabase PostgreSQL Database Schema
-- Supports 7 Stages: Identification -> Triage -> Facility -> Teleconsult -> Referral -> Follow-up -> Health Record
-- ========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PATIENTS TABLE (Step 1: Patient / ASHA Identifies Problem)
create table if not exists public.patients (
    id uuid primary key default uuid_generate_v4(),
    abha_id varchar(50) unique not null,
    full_name varchar(150) not null,
    age integer not null,
    gender varchar(20) not null,
    phone varchar(20),
    village varchar(100) not null,
    district varchar(100) not null,
    asha_worker_id varchar(50),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. PROBLEM INTAKE & SCREENING (Step 1)
create table if not exists public.problem_screenings (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade,
    reported_by varchar(30) not null default 'ASHA', -- 'Patient' or 'ASHA' or 'Doctor'
    chief_complaints text[] not null,
    symptoms_description text,
    voice_note_url text,
    onset_days integer default 1,
    is_pregnant boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. TRIAGE ASSESSMENTS (Step 2: Triage)
create table if not exists public.triage_assessments (
    id uuid primary key default uuid_generate_v4(),
    screening_id uuid references public.problem_screenings(id) on delete cascade,
    patient_id uuid references public.patients(id) on delete cascade,
    systolic_bp integer,
    diastolic_bp integer,
    pulse_rate integer,
    spo2_percentage integer,
    blood_glucose_mg_dl integer,
    body_temp_f numeric(4,1),
    danger_signs text[],
    urgency_level varchar(20) not null check (urgency_level in ('Emergency', 'Urgent', 'Routine')),
    clinical_score integer default 0,
    triaged_by varchar(100),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. HEALTHCARE FACILITIES (Step 3: Appropriate Facility)
create table if not exists public.facilities (
    id uuid primary key default uuid_generate_v4(),
    name varchar(150) not null,
    facility_type varchar(50) not null check (facility_type in ('Sub-Centre', 'PHC', 'CHC', 'District Hospital')),
    block_name varchar(100) not null,
    distance_km numeric(4,1) default 0.0,
    doctor_available boolean default true,
    specialties text[],
    emergency_beds_free integer default 0,
    icu_beds_free integer default 0,
    oxygen_available boolean default true,
    contact_phone varchar(20)
);

-- 5. APPOINTMENTS & TELECONSULTATIONS (Step 4: Appointment / Teleconsultation)
create table if not exists public.appointments (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade,
    facility_id uuid references public.facilities(id),
    doctor_name varchar(150),
    consultation_type varchar(30) default 'Teleconsultation' check (consultation_type in ('Teleconsultation', 'In-Person OPD', 'Emergency')),
    status varchar(30) default 'Scheduled' check (status in ('Scheduled', 'In-Progress', 'Completed', 'Cancelled')),
    scheduled_time timestamp with time zone default timezone('utc'::text, now()) not null,
    doctor_notes text,
    prescription_json jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. REFERRALS & TRANSPORT (Step 5: Referral)
create table if not exists public.referrals (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade,
    from_facility_id uuid references public.facilities(id),
    to_facility_id uuid references public.facilities(id),
    referral_reason text not null,
    priority varchar(20) not null default 'Urgent',
    ambulance_status varchar(30) default 'Dispatched' check (ambulance_status in ('Not Needed', 'Requested', 'Dispatched', 'En-Route', 'Arrived')),
    ambulance_vehicle_no varchar(50),
    eta_minutes integer,
    bed_held boolean default true,
    qr_reference_code varchar(100) unique not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. FOLLOW-UPS & HOME VISITS (Step 6: Follow-up)
create table if not exists public.follow_ups (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade,
    asha_id varchar(50),
    visit_date date not null,
    visit_type varchar(50) default 'Post-Referral Checkup',
    medication_adherent boolean default true,
    recovery_status varchar(50) default 'Improving' check (recovery_status in ('Recovered', 'Improving', 'Stable', 'Deteriorating', 'Re-referred')),
    observations text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. COMPLETED HEALTH RECORDS (Step 7: Record Updated)
create table if not exists public.health_records (
    id uuid primary key default uuid_generate_v4(),
    patient_id uuid references public.patients(id) on delete cascade,
    abha_linked boolean default true,
    final_diagnosis text not null,
    treatment_summary text,
    discharge_date timestamp with time zone default timezone('utc'::text, now()),
    care_pathway_summary jsonb,
    last_synced_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
alter table public.patients enable row level security;
alter table public.problem_screenings enable row level security;
alter table public.triage_assessments enable row level security;
alter table public.facilities enable row level security;
alter table public.appointments enable row level security;
alter table public.referrals enable row level security;
alter table public.follow_ups enable row level security;
alter table public.health_records enable row level security;

-- Allow public read/write access for demonstration & clinical portal app
create policy "Allow all operations for authenticated and anon" on public.patients for all using (true) with check (true);
create policy "Allow all operations on screenings" on public.problem_screenings for all using (true) with check (true);
create policy "Allow all operations on triage" on public.triage_assessments for all using (true) with check (true);
create policy "Allow all operations on facilities" on public.facilities for all using (true) with check (true);
create policy "Allow all operations on appointments" on public.appointments for all using (true) with check (true);
create policy "Allow all operations on referrals" on public.referrals for all using (true) with check (true);
create policy "Allow all operations on follow_ups" on public.follow_ups for all using (true) with check (true);
create policy "Allow all operations on health_records" on public.health_records for all using (true) with check (true);

-- ========================================================================
-- SEED SAMPLE FACILITIES
-- ========================================================================
insert into public.facilities (name, facility_type, block_name, distance_km, doctor_available, specialties, emergency_beds_free, icu_beds_free, oxygen_available, contact_phone)
values
('Rampur Ayushman Arogya Mandir (SC)', 'Sub-Centre', 'Rampur', 1.2, false, ARRAY['First Aid', 'Maternal Screening', 'Immunization'], 2, 0, false, '+91 94101 23451'),
('Beed Primary Health Centre (PHC)', 'PHC', 'Beed Rural', 5.8, true, ARRAY['General Medicine', 'Normal Delivery', 'Pediatric Care', 'Tele-OPD'], 6, 0, true, '+91 94101 88920'),
('Majalgaon Community Health Centre (CHC)', 'CHC', 'Majalgaon', 14.2, true, ARRAY['Obstetrics & Gynae', 'General Surgery', '24x7 Emergency', 'X-Ray & Lab'], 18, 2, true, '+91 94101 77103'),
('District Civil Hospital', 'District Hospital', 'Central District', 32.5, true, ARRAY['Cardiology', 'ICU & Trauma', 'High-Risk Obstetrics', 'Pediatric ICU', 'Blood Bank'], 45, 8, true, '+91 94101 00010');
