
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../hero';

// Mock the ShareButton component
jest.mock('../shareButton', () => {
  return function DummyShareButton() {
    return <div data-testid="share-button"></div>;
  };
});

describe('HeroSection', () => {
  it('renders with default props', () => {
    render(<HeroSection />);
    
    // Check for default profile name
    expect(screen.getByAltText('Profile hero background')).toBeInTheDocument();
    
    // Check for default images
    expect(screen.getByAltText('Profile hero background')).toHaveAttribute('src', '/placeholder.svg');
    expect(screen.getByAltText('Profile picture')).toHaveAttribute('src', '/placeholder.svg');

    // Check for subscribe and share buttons
    expect(screen.getByText('Suscribe')).toBeInTheDocument();
    expect(screen.getByTestId('share-button')).toBeInTheDocument();
  });

  it('renders with provided props', () => {
    const profileName = 'Fawredd';
    const backgroundImage = '/bg.jpg';
    const profileImage = '/profile.jpg';

    render(
      <HeroSection
        profileName={profileName}
        backgroundImage={backgroundImage}
        profileImage={profileImage}
      />
    );

    // Check for provided profile name in alt texts
    expect(screen.getByAltText(`${profileName} hero background`)).toBeInTheDocument();
    expect(screen.getByAltText(`${profileName} picture`)).toBeInTheDocument();

    // Check for provided images
    expect(screen.getByAltText(`${profileName} hero background`)).toHaveAttribute('src', backgroundImage);
    expect(screen.getByAltText(`${profileName} picture`)).toHaveAttribute('src', profileImage);

    // Check for subscribe button link
    const subscribeLink = screen.getByRole('link', { name: /suscribe/i });
    expect(subscribeLink).toHaveAttribute('href', `https://www.instagram.com/${profileName}`);
  });
});
