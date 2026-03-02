import React from 'react';
import { Search, Zap, Target, Shield, BarChart3, Globe } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      id: 1,
      title: "Meta Tag Scanner",
      description: "Comprehensive analysis of title tags, meta descriptions, and structured data to ensure optimal search engine visibility.",
      icon: <Search className="w-8 h-8 text-blue-500" />
    },
    {
      id: 2,
      title: "Performance Scanner",
      description: "Real-time monitoring of page speed, Core Web Vitals, and loading performance across desktop and mobile devices.",
      icon: <Zap className="w-8 h-8 text-blue-500" />
    },
    {
      id: 3,
      title: "Keyword Analysis",
      description: "Deep keyword research and density analysis to optimize your content for target search terms and improve rankings.",
      icon: <Target className="w-8 h-8 text-blue-500" />
    },
    {
      id: 4,
      title: "Technical SEO Audit",
      description: "Identify crawl errors, broken links, duplicate content, and other technical issues that impact search visibility.",
      icon: <Shield className="w-8 h-8 text-blue-500" />
    },
    {
      id: 5,
      title: "Ranking Tracker",
      description: "Track your website's position for target keywords over time with detailed analytics and competitor comparisons.",
      icon: <BarChart3 className="w-8 h-8 text-blue-500" />
    },
    {
      id: 6,
      title: "Site Architecture Analysis",
      description: "Evaluate URL structure, internal linking, sitemap optimization, and overall site hierarchy for better crawlability.",
      icon: <Globe className="w-8 h-8 text-blue-500" />
    }
  ];

  return (
    <section className="py-10">
      <div className="app-container">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful SEO features
            <br />
            built for results.
          </h2>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to optimize your website&apos;s search performance 
            and dominate search engine rankings.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="group  rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                  {feature.icon}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold  transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;