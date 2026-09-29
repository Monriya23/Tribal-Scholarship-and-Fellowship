import React from 'react';
import { Landmark, GraduationCap, ShieldCheck, Heart, CheckCircle2, Award, BookOpen } from 'lucide-react';

interface AboutPageProps {
  onFindScholarships: () => void;
  onExploreSchemes: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onFindScholarships, onExploreSchemes }) => {
  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--background)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--secondary-maroon)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <Landmark size={16} />
            Ministry of Tribal Affairs Initiative
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--primary-navy)', margin: '0.35rem 0 0.75rem 0', fontWeight: 800 }}>
            About the Platform
          </h1>
          <p style={{ fontSize: '1.08rem', color: 'var(--muted-text)', lineHeight: 1.65, margin: 0 }}>
            A unified digital public education service designed to empower Scheduled Tribe students across India with transparent scholarship discovery, merit fellowships, and streamlined Direct Benefit Transfer (DBT).
          </p>
        </div>

        {/* Authentic Educational Arc Gallery (School Foundation to Research Convocation) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img 
                src="/setu_photo_1_hero.png" 
                alt="Scheduled Tribe school students in uniform smiling and learning in a classroom with brick wall"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
              />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Foundation Support</span>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-maroon)', margin: '0.2rem 0 0.4rem 0', fontWeight: 700 }}>
                School & Pre-Matric Education
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                Ensuring tribal students in rural and remote regions stay in formal education through continuous financial and books support.
              </p>
            </div>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ height: '180px', overflow: 'hidden' }}>
              <img 
                src="/setu_photo_3_fellowship.png" 
                alt="Scheduled Tribe university graduates and research scholars in convocation gowns and graduation caps with ceremonial stoles"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
              />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>Academic Excellence</span>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', margin: '0.2rem 0 0.4rem 0', fontWeight: 700 }}>
                Higher Research & Convocations
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--muted-text)', margin: 0, lineHeight: 1.5 }}>
                Fueling M.Phil, Ph.D., and international degrees with prestigious national stipends and research fellowship grants.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Mission Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem', borderLeft: '5px solid var(--primary-navy)' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary-navy)', marginBottom: '1rem', fontWeight: 800 }}>
            Our National Objective
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text)', lineHeight: 1.7, margin: '0 0 1.25rem 0' }}>
            Education is the cornerstone of socio-economic empowerment. The Ministry of Tribal Affairs administers various scholarship and fellowship schemes to ensure that financial constraints do not hinder meritorious and aspiring Tribal youth from pursuing school education, professional degrees, doctoral research, and prestigious overseas studies.
          </p>
          <p style={{ fontSize: '0.96rem', color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
            This platform unifies all scholarship schemes under one single window, making it easy for students to find what they are eligible for, apply with confidence, and receive financial grants directly in their bank accounts.
          </p>
        </div>

        {/* 4 Core Principles */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', marginBottom: '1.5rem', fontWeight: 800 }}>
            Core Platform Principles
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--navy-subtle)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <CheckCircle2 size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontWeight: 700 }}>
                1. Transparent DBT Payments
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, margin: 0 }}>
                Scholarship funds are credited directly into Aadhaar-seeded bank accounts without middlemen or administrative delays.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--maroon-subtle)', color: 'var(--secondary-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <GraduationCap size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontWeight: 700 }}>
                2. Unified Discovery
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, margin: 0 }}>
                One platform catering to all stages: Pre-Matric, Post-Matric, Top Class, National Fellowships (NFST), and Overseas Scholarships (NOS).
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--navy-subtle)', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontWeight: 700 }}>
                3. Fair Rule Verification
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, margin: 0 }}>
                Deterministic eligibility criteria strictly derived from official Ministry guidelines, ensuring merit, transparency, and equity.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--maroon-subtle)', color: 'var(--secondary-maroon)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <Heart size={22} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', marginBottom: '0.5rem', fontWeight: 700 }}>
                4. Student-First Correction
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted-text)', lineHeight: 1.55, margin: 0 }}>
                No outright rejection for minor certificate issues. Clear deficiency notices give students simple opportunities to correct errors.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--primary-navy)', color: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#FFFFFF', fontWeight: 800, margin: '0 0 0.6rem 0' }}>
            Explore Opportunities Today
          </h3>
          <p style={{ fontSize: '0.96rem', color: 'rgba(255,255,255,0.85)', margin: '0 0 1.5rem 0' }}>
            Check your eligibility and submit your scholarship application online in minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={onFindScholarships}
              className="btn btn-primary btn-lg"
              style={{ fontWeight: 700 }}
            >
              Find My Scholarship
            </button>
            <button
              onClick={onExploreSchemes}
              className="btn btn-secondary btn-lg"
              style={{ fontWeight: 600 }}
            >
              Explore All Schemes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
