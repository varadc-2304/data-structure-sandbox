import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import { ArrowLeft, Zap, Waves, Target, Cpu, Radio, Antenna } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const ECEAlgorithms = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl mt-24 pb-12">
        <div className="mb-8 md:mb-12">
          <RouterLink to="/dashboard" className="inline-flex items-center text-primary hover:underline mb-4 md:mb-6 font-medium transition-colors text-sm md:text-base">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </RouterLink>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl md:text-5xl mb-3 md:mb-4">ECE Algorithms</h1>
            <p className="text-base text-muted-foreground sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed px-4">
              Explore electrical and computer engineering algorithms with interactive visualizations. 
              Understand signal processing, error correction, and communication system algorithms.
            </p>
          </div>
          
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border mb-6 md:mb-8">
            <h2 className="text-xl font-semibold text-foreground sm:text-2xl mb-3">Key Concepts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Signal processing and frequency domain analysis</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Error detection and correction codes</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>State estimation and filtering techniques</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p>Digital modulation and demodulation</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <CategoryCard
            title="Viterbi Algorithm"
            description="Visualize the Viterbi algorithm for finding the most likely sequence of hidden states in Hidden Markov Models."
            icon={<Zap size={28} />}
            to="/dashboard/ece-algorithms/viterbi"
          />
          <CategoryCard
            title="Fast Fourier Transform"
            description="Interactive visualization of FFT algorithm showing frequency domain transformation of signals."
            icon={<Waves size={28} />}
            to="/dashboard/ece-algorithms/fft"
          />
          <CategoryCard
            title="Kalman Filter"
            description="Visualize the Kalman Filter algorithm for optimal state estimation in noisy systems."
            icon={<Target size={28} />}
            to="/dashboard/ece-algorithms/kalman"
          />
          <CategoryCard
            title="LDPC Decoding"
            description="Low-Density Parity-Check decoding algorithm with iterative belief propagation visualization."
            icon={<Cpu size={28} />}
            to="/dashboard/ece-algorithms/ldpc"
          />
          <CategoryCard
            title="Turbo Decoding"
            description="Turbo decoding algorithm with parallel concatenated convolutional codes visualization."
            icon={<Radio size={28} />}
            to="/dashboard/ece-algorithms/turbo"
          />
          <CategoryCard
            title="Modulation Techniques"
            description="Interactive visualization of digital modulation techniques including QAM, PSK, and FSK."
            icon={<Antenna size={28} />}
            to="/dashboard/ece-algorithms/modulation"
          />
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              Algorithm Performance Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Algorithm</th>
                    <th className="text-left p-3 font-semibold text-foreground">Type</th>
                    <th className="text-left p-3 font-semibold text-foreground">Complexity</th>
                    <th className="text-left p-3 font-semibold text-foreground">Application</th>
                    <th className="text-left p-3 font-semibold text-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Viterbi</td>
                    <td className="p-3">Decoding</td>
                    <td className="p-3">O(n·k·2^m)</td>
                    <td className="p-3">Convolutional codes</td>
                    <td className="p-3">Optimal</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">FFT</td>
                    <td className="p-3">Transform</td>
                    <td className="p-3">O(n log n)</td>
                    <td className="p-3">Frequency analysis</td>
                    <td className="p-3">Efficient</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Kalman Filter</td>
                    <td className="p-3">Estimation</td>
                    <td className="p-3">O(n³)</td>
                    <td className="p-3">State tracking</td>
                    <td className="p-3">Optimal</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">LDPC</td>
                    <td className="p-3">Decoding</td>
                    <td className="p-3">O(n·d)</td>
                    <td className="p-3">Error correction</td>
                    <td className="p-3">Near-optimal</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Turbo</td>
                    <td className="p-3">Decoding</td>
                    <td className="p-3">O(n·i)</td>
                    <td className="p-3">Channel coding</td>
                    <td className="p-3">Near-optimal</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Modulation</td>
                    <td className="p-3">Signal</td>
                    <td className="p-3">O(1)</td>
                    <td className="p-3">Data transmission</td>
                    <td className="p-3">Real-time</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-6 md:p-8 border border-border">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl mb-4 md:mb-6 text-center">
              ECE Algorithm Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Reliable Communication</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Error correction ensures data integrity in noisy channels</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Waves className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Efficient Signal Processing</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Fast transforms enable real-time signal analysis</p>
              </div>
              <div>
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2 text-sm md:text-base">Accurate Estimation</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Filtering algorithms provide optimal state estimates</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 md:mt-16">
          <div className="bg-card rounded-lg p-4 md:p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground sm:text-xl mb-3">Did You Know?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm md:text-base text-muted-foreground">
              <p>• FFT reduces DFT complexity from O(n²) to O(n log n)</p>
              <p>• Viterbi algorithm finds the most likely sequence in HMMs</p>
              <p>• Turbo codes approach Shannon limit for channel capacity</p>
              <p>• Kalman filter provides optimal estimates for linear systems</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ECEAlgorithms;
