import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
  className?: string;
}

export function ModernTemplate({ data, className = '' }: ModernTemplateProps) {
  return (
    <div className={`bg-white text-gray-800 min-h-[297mm] w-[210mm] mx-auto shadow-lg ${className}`} style={{ fontSize: '11px', lineHeight: '1.4' }}>
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-blue-50 p-6">
          {/* Contact Info */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-blue-900 mb-4">{data.contact.fullName || 'Your Name'}</h1>
            <div className="space-y-2 text-sm">
              {data.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-700">{data.contact.email}</span>
                </div>
              )}
              {data.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-700">{data.contact.phone}</span>
                </div>
              )}
              {data.contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-700">{data.contact.location}</span>
                </div>
              )}
              {data.contact.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-700">{data.contact.website}</span>
                </div>
              )}
              {data.contact.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="h-3 w-3 text-blue-600" />
                  <span className="text-gray-700">{data.contact.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200">
                SKILLS
              </h2>
              {data.skills.map((skillGroup, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold text-blue-800 text-sm mb-1">{skillGroup.category}</h3>
                  <div className="flex flex-wrap gap-1">
                    {skillGroup.items.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex} 
                        className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-base font-bold text-blue-900 mb-3 pb-1 border-b border-blue-200">
                EDUCATION
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-4">
                  <h3 className="font-semibold text-blue-800 text-sm">{edu.degree}</h3>
                  <p className="text-gray-700 text-sm">{edu.field}</p>
                  <p className="text-gray-600 text-xs">{edu.school}</p>
                  <p className="text-gray-600 text-xs">{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  {edu.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 text-xs mt-1 ml-2">
                      {edu.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Main Content */}
        <div className="w-2/3 p-6">
          {/* Professional Summary */}
          {data.contact.summary && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-600">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700">{data.contact.summary}</p>
            </section>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-600">
                EXPERIENCE
              </h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-5">
                  <div className="mb-2">
                    <h3 className="font-bold text-blue-800 text-base">{exp.position}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 font-medium">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</p>
                    </div>
                    <p className="text-sm text-gray-500">{exp.location}</p>
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                      {exp.achievements.map((achievement, index) => (
                        <li key={index} className="mb-1">{achievement}</li>
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
              <h2 className="text-lg font-bold text-blue-900 mb-3 pb-1 border-b-2 border-blue-600">
                PROJECTS
              </h2>
              {data.projects.map((project) => (
                <div key={project.id} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-blue-800">{project.name}</h3>
                    {project.link && (
                      <span className="text-sm text-blue-600">{project.link}</span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-600">Tech Stack: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                      {project.highlights.map((highlight, index) => (
                        <li key={index} className="mb-1">{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
