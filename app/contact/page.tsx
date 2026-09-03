"use client";

import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Header - Shorter */}
      <section className="relative py-12 bg-gradient-to-br from-red-600 via-red-700 to-black text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
              Contact Optimal Sports
            </span>
          </h1>
          <p className="text-lg text-red-100 max-w-2xl mx-auto mb-6">
            Reach out and we&apos;ll respond within 24 hours.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-white to-red-300 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Tab Navigation removed for exclusivity */}

      {/* Forms Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'join' ? (
            /* Join the Team Form */
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Athlete Application
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Tell us about yourself and your athletic journey. We&apos;re excited to learn more about your goals and how we can help you achieve them.
                </p>
              </div>

              <form className="space-y-8">
                {/* Personal Information */}
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        First Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Last Name *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Email Address *
                      </label>
                      <input 
                        type="email" 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Phone Number *
                      </label>
                      <input 
                        type="tel" 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Athletic Information */}
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Athletic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        School/University *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                        placeholder="Enter your school name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Sport *
                      </label>
                      <select 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                      >
                        <option value="">Select your sport</option>
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="baseball">Baseball</option>
                        <option value="soccer">Soccer</option>
                        <option value="track">Track & Field</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Position *
                      </label>
                      <input 
                        type="text" 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                        placeholder="Enter your position"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Class Year *
                      </label>
                      <select 
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                      >
                        <option value="">Select class year</option>
                        <option value="freshman">Freshman</option>
                        <option value="sophomore">Sophomore</option>
                        <option value="junior">Junior</option>
                        <option value="senior">Senior</option>
                        <option value="graduate">Graduate</option>
                        <option value="high-school">High School</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Goals & Additional Info */}
                <div className="bg-gray-50 dark:bg-neutral-800 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Tell Us About Your Goals
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Career Goals & Aspirations *
                      </label>
                      <textarea 
                        required
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200 resize-none"
                        placeholder="Tell us about your athletic goals, where you see yourself in the next few years, and what you hope to achieve..."
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Current Achievements & Highlights
                      </label>
                      <textarea 
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200 resize-none"
                        placeholder="Share your key achievements, stats, awards, or any notable accomplishments..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    required
                    className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <Link href="/privacy" className="text-red-600 hover:text-red-700 underline">Privacy Policy</Link> and consent to being contacted about joining Optimal Sports Management.
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Submit Application
                </button>
              </form>
            </div>
          ) : (
            /* Reach Out Form */
            <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-neutral-700 p-8 md:p-12">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Have a question or want to learn more about our services? We&apos;d love to hear from you and will get back to you within 24 hours.
                </p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      First Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Last Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Subject *
                  </label>
                  <input 
                    type="text"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200"
                    placeholder="Enter your subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Message *
                  </label>
                  <textarea 
                    required
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-neutral-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-neutral-700 text-gray-900 dark:text-white text-base transition-all duration-200 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    required
                    className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-1"
                  />
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the <Link href="/privacy" className="text-red-600 hover:text-red-700 underline">Privacy Policy</Link> and consent to being contacted about my inquiry.
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Send Message
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Contact Information & Support */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-t border-gray-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Single Business Inquiries Dropdown */}
          <div className="mb-20">
            <div className="space-y-4">
              <details className="group border-2 border-gray-200 dark:border-neutral-700 rounded-2xl hover:border-red-300 dark:hover:border-red-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                <summary className="flex items-center justify-between p-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors rounded-2xl">
                  <div className="flex items-center gap-6">
                    <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 px-4 py-2 rounded-xl text-sm font-bold text-red-700 dark:text-red-300 shadow-md">
                      🤝 Partnerships
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Business Inquiries
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Brand collaborations and sponsorship opportunities
                      </p>
                    </div>
                  </div>
                  <svg className="w-8 h-8 text-gray-400 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-8 pb-8 border-t border-gray-200 dark:border-neutral-700">
                  <div className="pt-8">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                      We work with leading brands to create authentic partnerships with our athletes. Our team handles everything from initial outreach to contract execution and campaign management.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                      {[
                        "Brand Collaborations",
                        "Event Partnerships",
                        "Product Endorsements",
                        "Content Creation",
                      ].map((service, serviceIndex) => (
                        <div key={serviceIndex} className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 rounded-lg p-3 text-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{service}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-md">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                          <a href={`mailto:christophergil@optimalsports.net`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            christophergil@optimalsports.net
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-md">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                          <a href={`tel:+1 (555) 123-4569`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                            +1 (555) 123-4569
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Quick Contact Summary */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white text-center shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-red-100 mb-6 text-lg">
              Reach out using the form above for immediate assistance
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium">24-hour response</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium">Free consultation</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-medium">Immediate support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}