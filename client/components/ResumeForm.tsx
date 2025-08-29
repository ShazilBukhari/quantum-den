import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/GlassCard';
import { ResumeData, ContactInfo, Education, Experience, Project, Skill } from '@/types/resume';
import {
  Plus,
  Trash2,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Award,
  Save,
  Eye,
  Zap
} from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onPreview: () => void;
  onLoadSample?: () => void;
}

export function ResumeForm({ data, onChange, onPreview, onLoadSample }: ResumeFormProps) {
  const [activeSection, setActiveSection] = useState('contact');

  const updateContact = (updates: Partial<ContactInfo>) => {
    onChange({
      ...data,
      contact: { ...data.contact, ...updates }
    });
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      highlights: ['']
    };
    onChange({
      ...data,
      education: [...data.education, newEducation]
    });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange({
      ...data,
      education: data.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      location: '',
      achievements: ['']
    };
    onChange({
      ...data,
      experience: [...data.experience, newExperience]
    });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    onChange({
      ...data,
      experience: data.experience.map(exp => 
        exp.id === id ? { ...exp, ...updates } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      highlights: ['']
    };
    onChange({
      ...data,
      projects: [...data.projects, newProject]
    });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange({
      ...data,
      projects: data.projects.map(proj => 
        proj.id === id ? { ...proj, ...updates } : proj
      )
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(proj => proj.id !== id)
    });
  };

  const addSkillCategory = () => {
    const newSkillCategory: Skill = {
      category: '',
      items: []
    };
    onChange({
      ...data,
      skills: [...data.skills, newSkillCategory]
    });
  };

  const updateSkillCategory = (index: number, updates: Partial<Skill>) => {
    onChange({
      ...data,
      skills: data.skills.map((skill, i) => 
        i === index ? { ...skill, ...updates } : skill
      )
    });
  };

  const removeSkillCategory = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index)
    });
  };

  const updateArrayField = (array: string[], index: number, value: string): string[] => {
    const newArray = [...array];
    newArray[index] = value;
    return newArray;
  };

  const addArrayItem = (array: string[]): string[] => {
    return [...array, ''];
  };

  const removeArrayItem = (array: string[], index: number): string[] => {
    return array.filter((_, i) => i !== index);
  };

  const sections = [
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'skills', label: 'Skills', icon: Award }
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Resume Information</h2>
        <div className="flex items-center space-x-2">
          {onLoadSample && (
            <Button onClick={onLoadSample} variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Load Sample
            </Button>
          )}
          <Button onClick={onPreview} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b pb-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent text-muted-foreground'
            }`}
          >
            <section.icon className="h-4 w-4" />
            <span>{section.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        {activeSection === 'contact' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={data.contact.fullName}
                  onChange={(e) => updateContact({ fullName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.contact.email}
                  onChange={(e) => updateContact({ email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={data.contact.phone}
                  onChange={(e) => updateContact({ phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={data.contact.location}
                  onChange={(e) => updateContact({ location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={data.contact.website || ''}
                  onChange={(e) => updateContact({ website: e.target.value })}
                  placeholder="https://johndoe.com"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={data.contact.linkedin || ''}
                  onChange={(e) => updateContact({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/johndoe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                rows={4}
                value={data.contact.summary}
                onChange={(e) => updateContact({ summary: e.target.value })}
                placeholder="Brief professional summary highlighting your key skills and experience..."
              />
            </div>
          </div>
        )}

        {/* Education */}
        {activeSection === 'education' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Education
              </h3>
              <Button onClick={addEducation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
            
            {data.education.map((edu, index) => (
              <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Education #{index + 1}</h4>
                  <Button 
                    onClick={() => removeEducation(edu.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>School/University *</Label>
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                      placeholder="University of California"
                    />
                  </div>
                  
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  
                  <div>
                    <Label>Field of Study *</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      placeholder="Computer Science"
                    />
                  </div>
                  
                  <div>
                    <Label>GPA</Label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="3.8"
                    />
                  </div>
                  
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                      placeholder="2018"
                    />
                  </div>
                  
                  <div>
                    <Label>End Date</Label>
                    <Input
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      placeholder="2022"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Highlights/Achievements</Label>
                  {edu.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex gap-2 mt-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateEducation(edu.id, { 
                          highlights: updateArrayField(edu.highlights, highlightIndex, e.target.value)
                        })}
                        placeholder="Dean's List, Magna Cum Laude, etc."
                      />
                      <Button
                        onClick={() => updateEducation(edu.id, { 
                          highlights: addArrayItem(edu.highlights)
                        })}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      {edu.highlights.length > 1 && (
                        <Button
                          onClick={() => updateEducation(edu.id, { 
                            highlights: removeArrayItem(edu.highlights, highlightIndex)
                          })}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {activeSection === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Work Experience
              </h3>
              <Button onClick={addExperience} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
            
            {data.experience.map((exp, index) => (
              <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Experience #{index + 1}</h4>
                  <Button 
                    onClick={() => removeExperience(exp.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Google"
                    />
                  </div>
                  
                  <div>
                    <Label>Position *</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="Jan 2022"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        placeholder="Present"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Key Achievements</Label>
                  {exp.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex gap-2 mt-2">
                      <Textarea
                        value={achievement}
                        onChange={(e) => updateExperience(exp.id, { 
                          achievements: updateArrayField(exp.achievements, achievementIndex, e.target.value)
                        })}
                        placeholder="Developed and maintained..."
                        rows={2}
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => updateExperience(exp.id, { 
                            achievements: addArrayItem(exp.achievements)
                          })}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {exp.achievements.length > 1 && (
                          <Button
                            onClick={() => updateExperience(exp.id, { 
                              achievements: removeArrayItem(exp.achievements, achievementIndex)
                            })}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Code className="h-5 w-5 mr-2" />
                Projects
              </h3>
              <Button onClick={addProject} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
            
            {data.projects.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Project #{index + 1}</h4>
                  <Button 
                    onClick={() => removeProject(project.id)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Project Name *</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, { name: e.target.value })}
                      placeholder="E-commerce Website"
                    />
                  </div>
                  
                  <div>
                    <Label>Project Link</Label>
                    <Input
                      value={project.link || ''}
                      onChange={(e) => updateProject(project.id, { link: e.target.value })}
                      placeholder="https://github.com/user/project"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, { description: e.target.value })}
                    placeholder="Brief description of the project..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(project.id, { 
                      technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean)
                    })}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                
                <div>
                  <Label>Key Highlights</Label>
                  {project.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex gap-2 mt-2">
                      <Textarea
                        value={highlight}
                        onChange={(e) => updateProject(project.id, { 
                          highlights: updateArrayField(project.highlights, highlightIndex, e.target.value)
                        })}
                        placeholder="Key feature or achievement..."
                        rows={2}
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => updateProject(project.id, { 
                            highlights: addArrayItem(project.highlights)
                          })}
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        {project.highlights.length > 1 && (
                          <Button
                            onClick={() => updateProject(project.id, { 
                              highlights: removeArrayItem(project.highlights, highlightIndex)
                            })}
                            variant="outline"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Skills
              </h3>
              <Button onClick={addSkillCategory} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
            
            {data.skills.map((skillGroup, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Category #{index + 1}</h4>
                  <Button 
                    onClick={() => removeSkillCategory(index)} 
                    variant="outline" 
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <Label>Category Name</Label>
                  <Input
                    value={skillGroup.category}
                    onChange={(e) => updateSkillCategory(index, { category: e.target.value })}
                    placeholder="Programming Languages"
                  />
                </div>
                
                <div>
                  <Label>Skills (comma-separated)</Label>
                  <Input
                    value={skillGroup.items.join(', ')}
                    onChange={(e) => updateSkillCategory(index, { 
                      items: e.target.value.split(',').map(item => item.trim()).filter(Boolean)
                    })}
                    placeholder="JavaScript, Python, Java"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6 pt-6 border-t">
        <Button onClick={onPreview} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save & Preview</span>
        </Button>
      </div>
    </GlassCard>
  );
}
