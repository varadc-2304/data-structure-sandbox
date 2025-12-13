import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import MarkdownContent from "@/components/MarkdownContent";
// @ts-ignore - Vite raw import
import aboutContent from "../../content/about.md?raw";

const About = () => {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setContent(aboutContent);
  }, []);

  return (
    <>
      <SEO 
        title="About Ikshvaku Innovations - Drona | Education Technology Platform"
        description="Learn about Ikshvaku Innovations - building technology-enabled platforms that bring structure, visibility, and relevance to learning and career preparation. Founded by Varad Charholikar and Manas Jain."
        keywords="Ikshvaku Innovations, about us, education technology, learning platforms, career preparation, Varad Charholikar, Manas Jain, educational innovation"
      />
      <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
        <Navbar />
        
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12 md:py-16">
            {/* Header */}
            <div className="mb-8 md:mb-12">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                About Us
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <Card className="bg-card border border-border">
                <CardContent className="p-6 md:p-8">
                  <MarkdownContent content={content} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;

