import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CreativeTemplateProps {
  data: ResumeData;
  className?: string;
}

export function CreativeTemplate({ data, className = '' }: CreativeTemplateProps) {
  return (
    <div className={`bg-white text-gray-800 min-h-[297mm] w-[210mm] mx-auto shadow-lg ${className}`} style={{ fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white p-6">
        <h1 className="text-3xl font-bold mb-3">{data.contact.fullName || 'Your Name'}</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            {data.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span>{data.contact.email}</span>
              </div>
            )}
            {data.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{data.contact.phone}</span>
              </div>
            )}
            {data.contact.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>{data.contact.location}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            {data.contact.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                <span>{data.contact.website}</span>
              </div>
            )}
            {data.contact.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-3 w-3" />
                <span>{data.contact.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Professional Summary */}
        {data.contact.summary && (
          <section className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></div>
              <h2 className="text-lg font-bold text-purple-700">ABOUT ME</h2>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <p className="text-gray-700 italic">{data.contact.summary}</p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {data.experience.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full mr-3"></div>
                  <h2 className="text-lg font-bold text-pink-700">EXPERIENCE</h2>
                </div>
                {data.experience.map((exp, index) => (
                  <div key={exp.id} className="mb-5 relative">
                    {index < data.experience.length - 1 && (
                      <div className="absolute left-2 top-8 w-0.5 h-full bg-gradient-to-b from-pink-300 to-orange-300"></div>
                    )}
                    <div className="flex items-start">
                      <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-orange-300 rounded-full mr-4 mt-1 relative z-10"></div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-pink-800">{exp.position}</h3>
                              <p className="text-orange-700 font-medium">{exp.company}</p>
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p>{exp.startDate} - {exp.endDate}</p>
                              <p>{exp.location}</p>
                            </div>
                          </div>
                          {exp.achievements.length > 0 && (
                            <ul className="text-gray-700 space-y-1">
                              {exp.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-pink-500 mr-2">▸</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Projects */}
            {data.projects.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mr-3"></div>
                  <h2 className="text-lg font-bold text-orange-700">PROJECTS</h2>
                </div>
                {data.projects.map((project) => (
                  <div key={project.id} className="mb-4">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-orange-800">{project.name}</h3>
                        {project.link && (
                          <span className="text-sm text-orange-600">{project.link}</span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{project.description}</p>
                      {project.technologies.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, index) => (
                              <span 
                                key={index} 
                                className="bg-gradient-to-r from-orange-200 to-yellow-200 text-orange-800 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.highlights.length > 0 && (
                        <ul className="text-gray-700">
                          {project.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start mb-1">
                              <span className="text-orange-500 mr-2">▸</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {data.skills.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-3"></div>
                  <h2 className="text-base font-bold text-green-700">SKILLS</h2>
                </div>
                {data.skills.map((skillGroup, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-blue-700 text-sm mb-2">{skillGroup.category}</h3>
                    <div className="space-y-1">
                      {skillGroup.items.map((skill, skillIndex) => (
                        <div key={skillIndex} className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800 px-3 py-1 rounded-full text-xs text-center">
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
              <section>
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-3"></div>
                  <h2 className="text-base font-bold text-blue-700">EDUCATION</h2>
                </div>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                      <h3 className="font-bold text-blue-800 text-sm">{edu.degree}</h3>
                      <p className="text-purple-700 text-sm">{edu.field}</p>
                      <p className="text-gray-600 text-xs">{edu.school}</p>
                      <p className="text-gray-600 text-xs">{edu.startDate} - {edu.endDate}</p>
                      {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                      {edu.highlights.length > 0 && (
                        <ul className="text-gray-700 text-xs mt-2">
                          {edu.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start mb-1">
                              <span className="text-blue-500 mr-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
