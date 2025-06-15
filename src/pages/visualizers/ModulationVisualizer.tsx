
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ModulationVisualizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState([500]);
  const [modulationType, setModulationType] = useState('QAM');
  const [constellation, setConstellation] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [binaryData, setBinaryData] = useState('1011');
  const intervalRef = useRef(null);

  const maxSteps = 16;

  // Generate modulation data based on type
  const generateModulationData = (type, bits) => {
    const symbols = [];
    const time = [];
    const freq = [];
    
    for (let i = 0; i < bits.length; i += 2) {
      const bit1 = parseInt(bits[i] || '0');
      const bit2 = parseInt(bits[i + 1] || '0');
      
      let symbol = { x: 0, y: 0, phase: 0, amplitude: 1 };
      
      switch (type) {
        case 'QAM':
          // 4-QAM constellation
          symbol.x = bit1 === 0 ? -1 : 1;
          symbol.y = bit2 === 0 ? -1 : 1;
          symbol.amplitude = Math.sqrt(symbol.x * symbol.x + symbol.y * symbol.y);
          symbol.phase = Math.atan2(symbol.y, symbol.x);
          break;
          
        case 'PSK':
          // 4-PSK constellation
          const phaseMap = { '00': 0, '01': Math.PI/2, '11': Math.PI, '10': 3*Math.PI/2 };
          const bitPair = bits[i] + (bits[i+1] || '0');
          symbol.phase = phaseMap[bitPair] || 0;
          symbol.x = Math.cos(symbol.phase);
          symbol.y = Math.sin(symbol.phase);
          break;
          
        case 'FSK':
          // Binary FSK
          symbol.phase = bit1 === 0 ? 0 : Math.PI/4;
          symbol.x = Math.cos(symbol.phase);
          symbol.y = Math.sin(symbol.phase);
          break;
      }
      
      symbols.push(symbol);
      
      // Generate time domain signal
      for (let t = 0; t < 50; t++) {
        const timeVal = (i * 50 + t) / 10;
        let amplitude = 0;
        
        switch (type) {
          case 'QAM':
            amplitude = symbol.x * Math.cos(2 * Math.PI * timeVal) - 
                       symbol.y * Math.sin(2 * Math.PI * timeVal);
            break;
          case 'PSK':
            amplitude = Math.cos(2 * Math.PI * timeVal + symbol.phase);
            break;
          case 'FSK':
            const frequency = bit1 === 0 ? 1 : 2;
            amplitude = Math.cos(2 * Math.PI * frequency * timeVal);
            break;
        }
        
        time.push({ x: timeVal, y: amplitude });
      }
      
      // Generate frequency domain representation
      freq.push({
        frequency: type === 'FSK' ? (bit1 === 0 ? 1 : 2) : 1,
        magnitude: symbol.amplitude
      });
    }
    
    return { symbols, time, freq };
  };

  useEffect(() => {
    const data = generateModulationData(modulationType, binaryData);
    setConstellation(data.symbols);
    setTimeData(data.time);
    setFrequencyData(data.freq);
  }, [modulationType, binaryData]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % maxSteps);
      }, speed[0]);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleSkipToStart = () => setCurrentStep(0);
  const handleSkipToEnd = () => setCurrentStep(maxSteps - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-drona-light via-white to-drona-light">
      <Navbar />
      
      <div className="page-container mt-20">
        <div className="mb-8">
          <Link to="/ece-algorithms" className="flex items-center text-drona-green hover:underline mb-4 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ECE Algorithms
          </Link>
          <h1 className="text-4xl font-bold text-drona-dark mb-2">Modulation Techniques</h1>
          <p className="text-lg text-drona-gray">
            Visualize digital modulation techniques: QAM, PSK, and FSK
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
              <CardDescription>Configure the modulation visualization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Modulation Type</label>
                <Select value={modulationType} onValueChange={setModulationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="QAM">QAM (Quadrature Amplitude Modulation)</SelectItem>
                    <SelectItem value="PSK">PSK (Phase Shift Keying)</SelectItem>
                    <SelectItem value="FSK">FSK (Frequency Shift Keying)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Binary Data</label>
                <input
                  type="text"
                  value={binaryData}
                  onChange={(e) => setBinaryData(e.target.value.replace(/[^01]/g, ''))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter binary data (e.g., 1011)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Animation Speed: {speed[0]}ms
                </label>
                <Slider
                  value={speed}
                  onValueChange={setSpeed}
                  max={1000}
                  min={100}
                  step={50}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSkipToStart} size="sm" variant="outline">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={handlePlay} size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button onClick={handleReset} size="sm" variant="outline">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button onClick={handleSkipToEnd} size="sm" variant="outline">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Constellation Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Constellation Diagram</CardTitle>
              <CardDescription>Signal constellation points for {modulationType}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 border rounded bg-white relative">
                <svg width="100%" height="100%" viewBox="-2.5 -2.5 5 5" className="overflow-visible">
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="0.5" height="0.5" patternUnits="userSpaceOnUse">
                      <path d="M 0.5 0 L 0 0 0 0.5" fill="none" stroke="#e5e5e5" strokeWidth="0.05"/>
                    </pattern>
                  </defs>
                  <rect width="5" height="5" x="-2.5" y="-2.5" fill="url(#grid)" />
                  
                  {/* Axes */}
                  <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke="#666" strokeWidth="0.05" />
                  <line x1="0" y1="-2.5" x2="0" y2="2.5" stroke="#666" strokeWidth="0.05" />
                  
                  {/* Constellation points */}
                  {constellation.map((point, index) => (
                    <g key={index}>
                      <circle
                        cx={point.x}
                        cy={-point.y}
                        r="0.1"
                        fill={index === Math.floor(currentStep / 4) % constellation.length ? "#22c55e" : "#3b82f6"}
                        stroke="#fff"
                        strokeWidth="0.02"
                      />
                      <text
                        x={point.x + 0.15}
                        y={-point.y + 0.05}
                        fontSize="0.2"
                        fill="#666"
                      >
                        {binaryData.slice(index * 2, index * 2 + 2)}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Domain */}
          <Card>
            <CardHeader>
              <CardTitle>Time Domain Signal</CardTitle>
              <CardDescription>Modulated signal in time domain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 border rounded bg-white">
                <svg width="100%" height="100%" viewBox="0 0 400 200">
                  {/* Grid */}
                  <defs>
                    <pattern id="timeGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5e5" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#timeGrid)" />
                  
                  {/* Axes */}
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#666" strokeWidth="1" />
                  
                  {/* Signal */}
                  {timeData.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      points={timeData.map((point, index) => 
                        `${index * 2},${100 - point.y * 50}`
                      ).join(' ')}
                    />
                  )}
                  
                  {/* Current position indicator */}
                  <line
                    x1={currentStep * 25}
                    y1="0"
                    x2={currentStep * 25}
                    y2="200"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Info */}
          <Card>
            <CardHeader>
              <CardTitle>{modulationType} Information</CardTitle>
              <CardDescription>Current modulation technique details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Binary Data:</h4>
                  <p className="font-mono text-lg">{binaryData}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Current Symbol:</h4>
                  <p>Step {currentStep + 1} of {maxSteps}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">Technique Description:</h4>
                  {modulationType === 'QAM' && (
                    <p>QAM modulates both amplitude and phase. Each symbol represents 2 bits with different amplitude and phase combinations.</p>
                  )}
                  {modulationType === 'PSK' && (
                    <p>PSK modulates only the phase while keeping amplitude constant. Different phases represent different bit combinations.</p>
                  )}
                  {modulationType === 'FSK' && (
                    <p>FSK modulates the frequency. Different frequencies represent different bit values (binary FSK shown).</p>
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold">Key Properties:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {modulationType === 'QAM' && (
                      <>
                        <li>High spectral efficiency</li>
                        <li>Susceptible to amplitude noise</li>
                        <li>Used in cable modems, WiFi</li>
                      </>
                    )}
                    {modulationType === 'PSK' && (
                      <>
                        <li>Constant envelope signal</li>
                        <li>Good noise performance</li>
                        <li>Used in satellite communications</li>
                      </>
                    )}
                    {modulationType === 'FSK' && (
                      <>
                        <li>Simple implementation</li>
                        <li>Good noise immunity</li>
                        <li>Used in low-rate applications</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModulationVisualizer;
