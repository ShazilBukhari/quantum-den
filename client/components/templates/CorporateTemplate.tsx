import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CorporateTemplateProps {
  data: ResumeData;
  className?: string;
}

export function CorporateTemplate({ data, className = '' }: CorporateTemplateProps) {
  return (
    <div className={`bg-white text-black min-h-[297mm] w-[210mm] mx-auto shadow-lg ${className}`} style={{ fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="bg-slate-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">{data.contact.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          {data.contact.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{data.contact.email}</span>
            </div>
          )}
          {data.contact.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{data.contact.phone}</span>
            </div>
          )}
          {data.contact.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{data.contact.location}</span>
            </div>
          )}
          {data.contact.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>{data.contact.website}</span>
            </div>
          )}
          {data.contact.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              <span>{data.contact.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Professional Summary */}
        {data.contact.summary && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-slate-700">{data.contact.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">
              PROFESSIONAL EXPERIENCE
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-slate-800">{exp.position}</h3>
                    <p className="text-slate-600 font-medium">{exp.company}</p>
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{exp.startDate} - {exp.endDate}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside ml-4 text-slate-700">
                    {exp.achievements.map((achievement, index) => (
                      <li key={index} className="mb-1">{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">
              EDUCATION
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{edu.degree} in {edu.field}</h3>
                    <p className="text-slate-600">{edu.school}</p>
                    {edu.gpa && <p className="text-slate-600 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-right text-sm text-slate-600">
                    <p>{edu.startDate} - {edu.endDate}</p>
                  </div>
                </div>
                {edu.highlights.length > 0 && (
                  <ul className="list-disc list-inside ml-4 text-slate-700 mt-1">
                    {edu.highlights.map((highlight, index) => (
                      <li key={index} className="mb-1">{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">
              KEY PROJECTS
            </h2>
            {data.projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800">{project.name}</h3>
                  {project.link && (
                    <span className="text-sm text-slate-600">{project.link}</span>
                  )}
                </div>
                <p className="text-slate-700 mb-2">{project.description}</p>
                {project.technologies.length > 0 && (
                  <p className="text-sm text-slate-600 mb-2">
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                )}
                {project.highlights.length > 0 && (
                  <ul className="list-disc list-inside ml-4 text-slate-700">
                    {project.highlights.map((highlight, index) => (
                      <li key={index} className="mb-1">{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 border-b-2 border-slate-800 pb-1 mb-3">
              TECHNICAL SKILLS
            </h2>
            {data.skills.map((skillGroup, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold text-slate-800">{skillGroup.category}:</span>{' '}
                <span className="text-slate-700">{skillGroup.items.join(', ')}</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
