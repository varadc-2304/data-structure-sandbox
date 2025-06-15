
import React from 'react';
import Navbar from '@/components/Navbar';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Zap, Waves, Target, Cpu, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const ECEAlgorithms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">ECE Algorithms</h1>
          <p className="text-lg text-drona-gray">
            Explore electrical and computer engineering algorithms with interactive visualizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryCard
            title="Viterbi Algorithm"
            description="Visualize the Viterbi algorithm for finding the most likely sequence of hidden states in Hidden Markov Models."
            icon={<Zap size={28} />}
            to="/ece-algorithms/viterbi"
            delay={100}
          />
          <CategoryCard
            title="Fast Fourier Transform"
            description="Interactive visualization of FFT algorithm showing frequency domain transformation of signals."
            icon={<Waves size={28} />}
            to="/ece-algorithms/fft"
            delay={200}
          />
          <CategoryCard
            title="Kalman Filter"
            description="Visualize the Kalman Filter algorithm for optimal state estimation in noisy systems."
            icon={<Target size={28} />}
            to="/ece-algorithms/kalman"
            delay={300}
          />
          <CategoryCard
            title="LDPC Decoding"
            description="Low-Density Parity-Check decoding algorithm with iterative belief propagation visualization."
            icon={<Cpu size={28} />}
            to="/ece-algorithms/ldpc"
            delay={400}
          />
          <CategoryCard
            title="Turbo Decoding"
            description="Turbo decoding algorithm with parallel concatenated convolutional codes visualization."
            icon={<Radio size={28} />}
            to="/ece-algorithms/turbo"
            delay={500}
          />
        </div>
      </div>
    </div>
  );
};

export default ECEAlgorithms;
