import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  HealingStory,
  ImpactStats,
  ImpactChallenge,
} from '../../models/story.model';
import { COLORS } from '../../shared/constants/colors.constants';

@Injectable({
  providedIn: 'root',
})
export class StoryService {
  private apiUrl = '/api/stories';

  constructor(private http: HttpClient) {}

  // Is all data gonna be mock? Are we just using the server for account stuff?

  /**
   * Get featured story for landing page
   */
  getFeaturedStory(): Observable<HealingStory> {
    // For now, return mock data
    // TODO: Replace with actual API call when backend is ready
    // return this.http.get<HealingStory>(`${this.apiUrl}/featured`);

    return of(this.getMockFeaturedStory());
  }

  /**
   * Get all stories
   */
  getAllStories(): Observable<HealingStory[]> {
    // TODO: Replace with actual API call
    // return this.http.get<HealingStory[]>(this.apiUrl);

    return of([this.getMockFeaturedStory()]);
  }

  /**
   * Get story by ID
   */
  getStoryById(id: string): Observable<HealingStory> {
    // TODO: Replace with actual API call
    // return this.http.get<HealingStory>(`${this.apiUrl}/${id}`);

    return of(this.getMockFeaturedStory());
  }

  /**
   * Get impact statistics
   */
  getImpactStats(): Observable<ImpactStats> {
    return of({
      livesTouched: 2400,
      storiesOfHope: 156,
      recoveryRate: 98,
      supportAvailable: '24/7',
    });
  }

  /**
   * Get current impact challenges
   */
  getImpactChallenges(): Observable<ImpactChallenge[]> {
    return of([
      {
        title: 'Emergency Kits for New Arrivals',
        current: 18,
        goal: 25,
        unit: 'kits',
        color: COLORS.rose,
      },
      {
        title: 'Monthly Counseling Sessions',
        current: 142,
        goal: 200,
        unit: 'sessions',
        color: COLORS.lavender,
      },
    ]);
  }

  /**
   * Mock data for development
   * TODO: Remove when backend is ready
   */
  private getMockFeaturedStory(): HealingStory {
    return {
      id: 'maria-001',
      name: 'Maria',
      title: 'From Darkness to Dawn',
      currentStage: 3,
      totalStages: 6,
      thumbnail:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
      videoUrl: 'https://example.com/video.mp4',
      supporterCount: 47,
      lastUpdated: new Date(),
      featured: true,
      chapters: [
        {
          num: 1,
          title: 'Arrival',
          description: 'The first step toward safety',
          isUnlocked: true,
          content: {
            text: "Maria's journey begins...",
            videoUrl: 'https://example.com/chapter1.mp4',
          },
          unlockedDate: new Date('2025-01-01'),
        },
        {
          num: 2,
          title: 'Safety',
          description: 'Building trust and stability',
          isUnlocked: true,
          content: {
            text: 'Finding safety...',
            videoUrl: 'https://example.com/chapter2.mp4',
          },
          unlockedDate: new Date('2025-01-15'),
        },
        {
          num: 3,
          title: 'Stabilization',
          description: 'Finding inner balance',
          isUnlocked: true,
          content: {
            text: 'Building stability...',
            videoUrl: 'https://example.com/chapter3.mp4',
          },
          unlockedDate: new Date('2025-02-01'),
        },
        {
          num: 4,
          title: 'First Progress',
          description: 'Small victories emerge',
          isUnlocked: false,
        },
        {
          num: 5,
          title: 'Reintegration',
          description: 'Reconnecting with life',
          isUnlocked: false,
        },
        {
          num: 6,
          title: 'Autonomy',
          description: 'Independent and thriving',
          isUnlocked: false,
        },
      ],
    };
  }
}
