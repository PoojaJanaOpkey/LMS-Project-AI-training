import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryService } from '../../core/services/gallery.service';
import { GalleryItem } from '../../core/models/common.model';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);
  
  items: GalleryItem[] = [];
  filteredItems: GalleryItem[] = [];
  loading = true;
  selectedFilter = 'all';

  ngOnInit(): void {
    this.loadGalleryItems();
  }

  loadGalleryItems(): void {
    this.loading = true;
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.items = this.getMockGalleryItems();
      this.filteredItems = this.items;
      this.loading = false;
    }, 500);
  }

  filterItems(type: string): void {
    this.selectedFilter = type;
    if (type === 'all') {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter(item => item.type === type);
    }
  }

  private getMockGalleryItems(): GalleryItem[] {
    return [
      {
        id: 1,
        title: 'Web Development Workshop',
        description: 'Students learning modern web development techniques',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
        uploadedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Design Thinking Session',
        description: 'UI/UX design collaboration and brainstorming',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400',
        uploadedAt: new Date('2024-01-20')
      },
      {
        id: 3,
        title: 'Introduction to Programming',
        description: 'First lesson in our programming fundamentals course',
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
        uploadedAt: new Date('2024-02-01')
      },
      {
        id: 4,
        title: 'Student Graduation Ceremony',
        description: 'Celebrating our successful graduates',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400',
        uploadedAt: new Date('2024-02-15')
      },
      {
        id: 5,
        title: 'Data Science Tutorial',
        description: 'Machine learning basics with Python',
        type: 'video',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        uploadedAt: new Date('2024-02-20')
      },
      {
        id: 6,
        title: 'Course Syllabus - Web Dev',
        description: 'Complete syllabus for Full Stack Web Development',
        type: 'document',
        url: '#',
        thumbnailUrl: 'https://via.placeholder.com/400x300/6c757d/ffffff?text=PDF',
        uploadedAt: new Date('2024-03-01')
      },
      {
        id: 7,
        title: 'Campus Tour',
        description: 'Virtual tour of our learning facilities',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
        uploadedAt: new Date('2024-03-10')
      },
      {
        id: 8,
        title: 'Marketing Strategy Guide',
        description: 'Digital marketing best practices guide',
        type: 'document',
        url: '#',
        thumbnailUrl: 'https://via.placeholder.com/400x300/0d6efd/ffffff?text=PDF',
        uploadedAt: new Date('2024-03-15')
      },
      {
        id: 9,
        title: 'Group Study Session',
        description: 'Students collaborating on projects',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
        uploadedAt: new Date('2024-03-20')
      }
    ];
  }
}
