export interface ProjectImage {
    url: string;
    alt?: string;
}

export interface Testimonial {
    content: string;
    author: string;
    position: string;
}

export interface Project {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    client: string;
    date: string;
    technologies: string;
    features: string[];
    images: ProjectImage[];
    liveUrl?: string;
    sourceUrl?: string;
    testimonial?: Testimonial;
}