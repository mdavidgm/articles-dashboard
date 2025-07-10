/** Single Source of Truth (SSoT)
 * This file defines the types used throughout the application to avoid duplication and inconsistencies
 **/

export interface ArticleCard {
  id: number;
  title: string;
  author: string;
  content: string;
  views: number;
  shares: number;
  createdAt: Date;
  summary?: string;
}