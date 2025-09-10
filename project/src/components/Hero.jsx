import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Award } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Premium Quality',
      description: 'Lab-tested for purity and potency'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast Results',
      description: 'See results in just weeks'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Trusted Brand',
      description: 'Chosen by fitness professionals'
    }
  ];

  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Build Your 
                <span className="block text-accent">Dream Body</span>
              </h1>
              <p className="font-body text-lg sm:text-xl text-neutral-200 mt-6 max-w-lg">
                Premium protein supplements and nutrition products designed to fuel your 
                fitness journey and help you achieve extraordinary results.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-body font-semibold rounded-lg hover:bg-accent/90 transition-colors group"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* <button className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-body font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors">
                Learn More
              </button> */}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start mb-3">
                    <div className="p-2 bg-accent/20 rounded-lg text-accent">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-neutral-200">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-accent/30 to-transparent p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&dpr=1"
                    alt="Fitness athlete"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-accent text-white p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="font-heading font-bold text-xl">25g</div>
                  <div className="font-body text-xs">Protein</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-primary p-4 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="font-heading font-bold text-xl">100%</div>
                  <div className="font-body text-xs">Natural</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;