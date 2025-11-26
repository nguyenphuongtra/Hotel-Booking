import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props} />
);

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ className, ...props }) => (
  <img className={`aspect-square h-full w-full ${className}`} {...props} />
);

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ className, ...props }) => (
  <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-100 ${className}`} {...props} />
);
