import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  imports: [CommonModule, RouterLink],
})
export class AboutComponent {
  readonly coreCapabilities = [
    {
      title: 'Busca de livros',
      description:
        'Encontre livros por título, autor e temas com resposta rápida e foco em relevância.',
      gradient: 'from-violet-50 to-purple-50',
      iconBg: 'bg-violet-600',
      iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    },
    {
      title: 'Biblioteca pessoal',
      description:
        'Salve favoritos, organize suas leituras e mantenha os livros importantes sempre acessíveis.',
      gradient: 'from-fuchsia-50 to-pink-50',
      iconBg: 'bg-fuchsia-600',
      iconPath:
        'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    },
    {
      title: 'Detalhes completos',
      description:
        'Consulte informações de publicação, sinopse e links externos para continuar sua descoberta.',
      gradient: 'from-purple-50 to-indigo-50',
      iconBg: 'bg-purple-600',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Experiência responsiva',
      description:
        'Layout consistente em desktop e mobile para leitura e exploração sem fricção.',
      gradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-600',
      iconPath:
        'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
  ] as const;

  readonly technologies = [
    'Angular',
    'TypeScript',
    'Tailwind CSS',
    'Google Books API',
  ] as const;

  readonly professionalLinks = [
    {
      name: 'Portfolio',
      url: 'https://dev-francisco-fernando.vercel.app/',
      description: 'Projetos e experiência profissional',
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/gerfernandosouza/',
      description: 'Perfil profissional e networking',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/Fernando32117',
      description: 'Código-fonte e contribuições',
    },
  ] as const;
}
