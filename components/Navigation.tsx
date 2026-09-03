"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { athletes } from "@/lib/athletes";
import { schools, getSchoolByName } from "@/lib/schools";

export default function Navigation() {
  const router = useRouter();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle theme mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
      if (event.key === 'Escape') {
        setShowResults(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    // Search athletes
    const athleteResults = athletes.filter(athlete => 
      athlete.name.toLowerCase().includes(lowerQuery) ||
      athlete.school.toLowerCase().includes(lowerQuery) ||
      athlete.position.toLowerCase().includes(lowerQuery) ||
      athlete.conference.toLowerCase().includes(lowerQuery)
    );
    
    // Search schools/teams
    const schoolResults = schools.filter(school => 
      school.name.toLowerCase().includes(lowerQuery) ||
      school.shortName.toLowerCase().includes(lowerQuery) ||
      school.mascot.toLowerCase().includes(lowerQuery) ||
      school.conference.toLowerCase().includes(lowerQuery)
    );
    
    // Combine results with type indicators
    const combinedResults = [
      ...athleteResults.map(athlete => ({ ...athlete, type: 'athlete' })),
      ...schoolResults.map(school => ({ ...school, type: 'school' }))
    ];
    
    setSearchResults(combinedResults);
    setShowResults(true);
  };

  const handleResultClick = (result: any) => {
    setSearchQuery("");
    setShowResults(false);
    
    if (result.type === 'athlete') {
      // Navigate to athlete page
      router.push(`/athletes/${result.slug}`);
    } else if (result.type === 'school') {
      // Navigate to athletes page filtered by school
      router.push(`/athletes?school=${encodeURIComponent(result.name)}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-sm bg-white/80 dark:bg-black/80 shadow-sm border-b border-gray-100/20' 
        : ''
    }`} style={isScrolled ? {} : { backgroundColor: 'transparent', border: 'none' }}>
      {/* removed top strip per request */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="leading-none flex items-end gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={mounted && resolvedTheme === 'light' 
              ? "/output-onlinepngtools (5).png" 
              : "/Final_2_Transparent_png_180x-_1_.png"
            } 
            alt="Optimal Sports Management" 
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8" ref={searchRef}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search athletes, teams, or content..."
              className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                ⌘K
              </kbd>
            </div>
            
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={result.type === 'athlete' ? result.slug : result.name}
                    onClick={() => handleResultClick(result)}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                  >
                    {result.type === 'athlete' ? (
                      // Athlete Result
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {result.position} • {result.school}
                          </div>
                        </div>
                        <div className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                          Athlete
                        </div>
                      </div>
                    ) : (
                      // School Result
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                            {result.shortName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {result.mascot} • {result.conference}
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                          Team
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-6 text-[15px]">
          <li><Link href="/athletes" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Athletes</Link></li>
          <li><Link href="/services" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Services</Link></li>
          <li><Link href="/catalog" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Shop</Link></li>
          <li><Link href="/about" className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">About</Link></li>

          <li><ThemeToggle /></li>
          <li>
            <Link href="/contact" className="ml-2 bg-red-600 hover:bg-red-700 text-white rounded-full px-4 py-2 text-sm font-semibold">Contact</Link>
          </li>
        </ul>

        {/* Mobile Icons */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Search Icon */}
          <button
            onClick={toggleSearch}
            className="p-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search athletes, teams, or content..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  autoFocus
                />
              </div>
              <button
                onClick={toggleSearch}
                className="p-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={result.type === 'athlete' ? result.slug : result.name}
                    onClick={() => handleResultClick(result)}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                  >
                    {result.type === 'athlete' ? (
                      // Athlete Result
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                          <img 
                            src={result.image} 
                            alt={result.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {result.position} • {result.school}
                          </div>
                        </div>
                        <div className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                          Athlete
                        </div>
                      </div>
                    ) : (
                      // School Result
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                            {result.shortName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">{result.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {result.mascot} • {result.conference}
                          </div>
                        </div>
                        <div className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                          Team
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="space-y-4">
              <Link 
                href="/athletes" 
                className="block py-2 text-lg font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Athletes
              </Link>
              <Link 
                href="/services" 
                className="block py-2 text-lg font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/catalog" 
                className="block py-2 text-lg font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/about" 
                className="block py-2 text-lg font-medium text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/contact" 
                className="block w-full bg-red-600 hover:bg-red-700 text-white text-center font-semibold py-3 px-4 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}