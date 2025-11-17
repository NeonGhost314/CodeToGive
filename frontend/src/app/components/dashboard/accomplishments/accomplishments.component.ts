import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { DashboardData } from '../../../models/dashboard.model';

export interface Badge {
  id: number;
  title: string;
  description: string;
  icon: string;
  requirement: number; // Amount needed to unlock
  requirementType: 'donation_amount' | 'donation_count' | 'goal_count' | 'subscription_count' | 'newsletter_subscription';
  unlocked: boolean;
  socialMessage: string;
}

@Component({
  selector: 'app-accomplishments',
  imports: [CommonModule, DecimalPipe],
  templateUrl: './accomplishments.component.html',
  styleUrl: './accomplishments.component.scss'
})
export class AccomplishmentsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dashboardData?: DashboardData;
  private newsletterEventListener?: () => void;

  badges: Badge[] = [
    {
      id: 1,
      title: 'First Step',
      description: 'Make your first donation',
      icon: 'star',
      requirement: 1,
      requirementType: 'donation_amount',
      unlocked: false,
      socialMessage: 'I just made my first donation to help make a difference! ⭐ #GivingBack #FirstDonation'
    },
    {
      id: 2,
      title: 'Newsletter Subscriber',
      description: 'Subscribe to our newsletter',
      icon: 'mail',
      requirement: 1,
      requirementType: 'newsletter_subscription',
      unlocked: false,
      socialMessage: 'I\'ve subscribed to stay updated on making a positive impact! 📧 Stay informed, stay involved! #Newsletter #Community'
    },
    {
      id: 3,
      title: 'Consistent Supporter',
      description: 'Make 5 donations',
      icon: 'refresh',
      requirement: 5,
      requirementType: 'donation_count',
      unlocked: false,
      socialMessage: 'I\'ve made 5 donations and counting! 🔄 Consistency in giving makes a lasting impact! #ConsistentGiving'
    },
    {
      id: 4,
      title: 'Goal Setter',
      description: 'Set up a personal donation goal',
      icon: 'flag',
      requirement: 1,
      requirementType: 'goal_count',
      unlocked: false,
      socialMessage: 'I\'ve set my first personal donation goal! 🎯 Planning to make an even bigger impact! #GoalSetter #PurposefulGiving'
    },
    {
      id: 5,
      title: 'Champion Donor',
      description: 'Donate $500 or more total',
      icon: 'emoji_events',
      requirement: 500,
      requirementType: 'donation_amount',
      unlocked: false,
      socialMessage: 'I\'ve reached $500 in total donations! 🏆 Proud to be making a significant impact! #ChampionDonor #Impact'
    }
  ];

  ngOnInit(): void {
    this.updateBadgeStatus();
    
    // Listen for newsletter subscription events
    this.newsletterEventListener = () => {
      console.log('Newsletter subscription detected, updating badges');
      this.updateBadgeStatus();
    };
    window.addEventListener('newsletterSubscribed', this.newsletterEventListener);
  }

  ngOnDestroy(): void {
    // Clean up event listener
    if (this.newsletterEventListener) {
      window.removeEventListener('newsletterSubscribed', this.newsletterEventListener);
    }
  }

  ngOnChanges(): void {
    const wasGoalSetterUnlocked = this.badges.find(b => b.id === 4)?.unlocked || false;
    const wasNewsletterUnlocked = this.badges.find(b => b.id === 2)?.unlocked || false;
    
    this.updateBadgeStatus();
    
    // Check if Goal Setter badge was just unlocked
    const isGoalSetterUnlocked = this.badges.find(b => b.id === 4)?.unlocked || false;
    if (!wasGoalSetterUnlocked && isGoalSetterUnlocked) {
      console.log('🎉 Goal Setter badge unlocked! You\'ve created your first personal goal.');
    }
    
    // Check if Newsletter Subscriber badge was just unlocked
    const isNewsletterUnlocked = this.badges.find(b => b.id === 2)?.unlocked || false;
    if (!wasNewsletterUnlocked && isNewsletterUnlocked) {
      console.log('🎉 Newsletter Subscriber badge unlocked! You\'ve subscribed to our newsletter.');
    }
  }

  updateBadgeStatus(): void {
    if (!this.dashboardData) return;

    const donationCount = this.dashboardData.recent_donations.length;
    const totalDonations = this.dashboardData.total_donations;
    const goalCount = this.dashboardData.goals?.length || 0;
    const subscriptionCount = this.dashboardData.subscriptions.length;
    const hasPersonalGoals = this.dashboardData.goals && this.dashboardData.goals.length > 0;
    // Check if user has subscribed to newsletter (you may need to add this to dashboard data)
    const newsletterSubscribed = localStorage.getItem('newsletterSubscribed') === 'true';

    // Debug logging
    console.log('Badge status update:', {
      donationCount,
      totalDonations,
      goalCount,
      hasPersonalGoals,
      newsletterSubscribed,
      goals: this.dashboardData.goals
    });

    this.badges.forEach(badge => {
      switch (badge.requirementType) {
        case 'donation_amount':
          badge.unlocked = totalDonations >= badge.requirement;
          break;
        case 'donation_count':
          badge.unlocked = donationCount >= badge.requirement;
          break;
        case 'goal_count':
          // Explicitly check if user has created personal goals
          badge.unlocked = hasPersonalGoals && goalCount >= badge.requirement;
          break;
        case 'subscription_count':
          badge.unlocked = subscriptionCount >= badge.requirement;
          break;
        case 'newsletter_subscription':
          badge.unlocked = newsletterSubscribed;
          break;
      }
    });
  }

  shareOnSocial(badge: Badge, platform: 'facebook' | 'linkedin' | 'twitter'): void {
    if (!badge.unlocked) return;

    const message = encodeURIComponent(badge.socialMessage);
    const url = encodeURIComponent(window.location.origin);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${message}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${message}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${message}&url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  getUnlockedCount(): number {
    return this.badges.filter(badge => badge.unlocked).length;
  }

  hasPersonalGoals(): boolean {
    return this.dashboardData?.goals && this.dashboardData.goals.length > 0 || false;
  }

  getGoalCountText(): string {
    if (!this.dashboardData?.goals) return '0 goals';
    const count = this.dashboardData.goals.length;
    return count === 1 ? '1 goal' : `${count} goals`;
  }

  getProgressPercentage(badge: Badge): number {
    if (!this.dashboardData || badge.unlocked) return badge.unlocked ? 100 : 0;

    let current = 0;
    switch (badge.requirementType) {
      case 'donation_amount':
        current = this.dashboardData.total_donations;
        break;
      case 'donation_count':
        current = this.dashboardData.recent_donations.length;
        break;
      case 'goal_count':
        // Show progress based on actual goal count
        current = this.dashboardData.goals?.length || 0;
        break;
      case 'subscription_count':
        current = this.dashboardData.subscriptions.length;
        break;
      case 'newsletter_subscription':
        current = localStorage.getItem('newsletterSubscribed') === 'true' ? 1 : 0;
        break;
    }

    return Math.min(100, (current / badge.requirement) * 100);
  }
}
