import React, { useState, useEffect } from 'react';
import { HeroHeader } from './components/HeroHeader';
import { ImageUploader } from './components/ImageUploader';
import { ResultView } from './components/ResultView';
import { generateVSCover, checkApiKey, openApiKeySelection } from './services/geminiService';
import { AspectRatio, ImageResolution, CompositionType, PosterStyle } from './types';
import { Swords, Zap, Loader2, Sparkles, SlidersHorizontal, Type, LayoutTemplate, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [imageA, setImageA] = useState<string | null>(null);
  const [imageB, setImageB] = useState<string | null>(null);
  
  // New State for Enhanced Control
  const [nameA, setNameA] = useState('');
  const [nameB, setNameB] = useState('');
  const [composition, setComposition] = useState<CompositionType>(CompositionType.SPLIT_DIAGONAL);
  const [style, setStyle] = useState<PosterStyle>(PosterStyle.BROADCAST_3D);
  const [prompt, setPrompt] = useState('');
  
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.PORTRAIT_9_16);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution.RES_2K);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    // Initial check
    checkApiKey().then(setHasApiKey);
  }, []);

  const buildSmartPrompt = () => {
    const subjectA = nameA.trim() || 'Home Team';
    const subjectB = nameB.trim() || 'Away Team';

    let basePrompt = `Create a high-impact promotional poster for a match between ${subjectA} and ${subjectB}. `;

    // Composition instructions
    switch (composition) {
        case CompositionType.SPLIT_DIAGONAL:
            basePrompt += `Use a dynamic diagonal split composition. Place ${subjectA} on the top-left/left and ${subjectB} on the bottom-right/right with contrasting color schemes. `;
            break;
        case CompositionType.FACE_OFF:
            basePrompt += `Close-up profile side-view of both subjects staring intensely at each other (face-off), very close range. `;
            break;
        case CompositionType.DOUBLE_EXPOSURE:
            basePrompt += `Use an artistic double exposure effect, blending the players with their team crests or stadium backgrounds. `;
            break;
        case CompositionType.ACTION_COLLAGE:
            basePrompt += `A dynamic collage featuring full-body action shots of the players in motion with explosive energy effects. `;
            break;
        case CompositionType.CENTER_FOCUS:
            basePrompt += `Place both subjects symmetrically around a central glowing energy source. `;
            break;
        case CompositionType.V_FORMATION:
             basePrompt += `Arrange the two subjects in a V-shape formation at the top, looking down towards the center. High angle perspective with dramatic lighting. `;
             break;
        case CompositionType.TOP_BOTTOM:
             basePrompt += `Split the design horizontally. Top half for ${subjectA}, bottom half for ${subjectB}. Distinct color separation and clean layout. `;
             break;
        case CompositionType.TEAM_CREST_BACK:
             basePrompt += `Place the subjects prominently in the foreground. In the background, place massive, semi-transparent team crests/logos looming behind them for a grand scale effect. `;
             break;
    }

    // Style instructions
    switch (style) {
        case PosterStyle.REALISTIC_STADIUM:
            basePrompt += `Background should be a photorealistic stadium at night with floodlights, crowd atmosphere, and lens flares. Professional photography style. `;
            break;
        case PosterStyle.CYBERPUNK_NEON:
            basePrompt += `Cyberpunk aesthetic with heavy neon blue and magenta lighting, glitch effects, rain, and futuristic UI elements. `;
            break;
        case PosterStyle.GRUNGE_TEXTURE:
            basePrompt += `Gritty urban grunge style with concrete textures, smoke, ink splatters, high contrast, and dramatic shadows. `;
            break;
        case PosterStyle.BROADCAST_3D:
            basePrompt += `Premium TV broadcast graphics style. Shiny 3D metallic elements, glass textures, clean studio lighting, very polished. `;
            break;
        case PosterStyle.ILLUSTRATIVE:
            basePrompt += `Dynamic comic book or digital illustration style. Bold outlines, vibrant colors, expressive shading. `;
            break;
        case PosterStyle.GOLD_LUXURY:
            basePrompt += `Luxury aesthetic. Black and Gold color palette, marble textures, golden particles, elegant lighting. `;
            break;
        case PosterStyle.RETRO_VINTAGE:
            basePrompt += `90s football poster aesthetic. Grainy texture, vibrant geometric shapes, halftone patterns, VHS glitch effect, retro typography. `;
            break;
        case PosterStyle.INK_SPLASH:
             basePrompt += `Artistic watercolor and ink splash style. Fluid liquid effects blending with the players, paint drips, expressive brush strokes. `;
             break;
        case PosterStyle.PAPER_COLLAGE:
             basePrompt += `Mixed media paper collage style. Ripped paper edges, tape textures, layered paper cutouts, grunge overlay. `;
             break;
        case PosterStyle.MINIMALIST_FLAT:
             basePrompt += `Clean minimalist vector art style. Flat colors, simple geometric shapes, negative space, sharp vector lines, modern typography. `;
             break;
    }

    // Text Instructions (The specific request for "VS" and designed names)
    basePrompt += `Prominently display the text "VS" in the center using a stylized, 3D metallic badge design that matches the background style. `;
    
    if (nameA.trim() && nameB.trim()) {
        basePrompt += `Render the text "${subjectA}" and "${subjectB}" using large, bold, custom typography. The font should be aggressive and sporty. Ensure the text is legible and integrated into the design. `;
    }

    // Add user custom prompt details if any
    if (prompt.trim()) {
        basePrompt += ` Additional details: ${prompt}`;
    }

    return basePrompt;
  };

  const handleGenerate = async () => {
    if (!hasApiKey) {
        await openApiKeySelection();
        const keySelected = await checkApiKey();
        if (keySelected) {
            setHasApiKey(true);
        } else {
            return;
        }
    }

    if (!imageA && !imageB && !nameA && !nameB) {
        alert("Please upload images or provide team names.");
        return;
    }

    setIsGenerating(true);
    try {
      const finalPrompt = buildSmartPrompt();
      console.log("Generating with prompt:", finalPrompt);
      const resultUrl = await generateVSCover(finalPrompt, imageA, imageB, aspectRatio, resolution);
      setGeneratedImage(resultUrl);
    } catch (error) {
      console.error(error);
      alert("Failed to generate image. Please ensure you have selected a valid API Key with billing enabled.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-yellow-500/30">
      <HeroHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Intro */}
        <div className="mb-8 text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white display-font tracking-wide">
                CREATE THE HYPE
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
                Generate professional "VS" matchday posters. Customize the angle, style, and text with Gemini 3 Pro.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Inputs (Images & Text) - Spans 8 cols */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Team A / Team B Section */}
                <div className="flex flex-col md:flex-row items-stretch gap-6 relative">
                    {/* Team A Input */}
                    <div className="flex-1 space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-blue-900/50 transition-colors">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                             <span className="font-bold text-blue-400 uppercase tracking-wider">Home / Side A</span>
                         </div>
                         <ImageUploader 
                            label="Upload Image A" 
                            selectedImage={imageA} 
                            onImageSelect={setImageA} 
                            side="left"
                        />
                         <div className="relative">
                            <Type className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                                type="text"
                                value={nameA}
                                onChange={(e) => setNameA(e.target.value)}
                                placeholder="Enter Name (e.g. Chelsea)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                         </div>
                    </div>
                    
                    {/* VS Badge (Absolute Center) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex-col items-center justify-center">
                         <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full shadow-xl shadow-orange-900/40 border-4 border-[#0f172a] flex items-center justify-center transform hover:scale-110 transition-transform">
                            <span className="font-black text-black text-xl italic pr-0.5">VS</span>
                         </div>
                    </div>

                    {/* Team B Input */}
                    <div className="flex-1 space-y-3 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-red-900/50 transition-colors">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                             <span className="font-bold text-red-400 uppercase tracking-wider">Away / Side B</span>
                         </div>
                         <ImageUploader 
                            label="Upload Image B" 
                            selectedImage={imageB} 
                            onImageSelect={setImageB} 
                            side="right"
                        />
                         <div className="relative">
                            <Type className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                            <input 
                                type="text"
                                value={nameB}
                                onChange={(e) => setNameB(e.target.value)}
                                placeholder="Enter Name (e.g. Barcelona)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            />
                         </div>
                    </div>
                </div>

                {/* Additional Text Prompt */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Additional Details (Optional)</h3>
                    </div>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full h-24 bg-black/30 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:ring-1 focus:ring-yellow-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Add specific details like 'rainy weather', 'red smoke', 'confetti', etc."
                    />
                </div>
            </div>

            {/* Right Column - Controls (Style, Composition, Settings) - Spans 4 cols */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Visual Transformer Controls */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sticky top-6 space-y-8">
                    
                    {/* Composition / Angle Selector */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <LayoutTemplate className="w-5 h-5 text-purple-400" />
                            <label className="text-sm font-bold text-white uppercase tracking-wider">Composition (Angle)</label>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                            {Object.values(CompositionType).map((comp) => (
                                <button
                                    key={comp}
                                    onClick={() => setComposition(comp)}
                                    className={`py-2 px-3 rounded-lg text-sm text-left font-medium transition-all border ${
                                        composition === comp 
                                        ? 'bg-purple-900/30 border-purple-500 text-purple-200' 
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    {comp}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Style / Scenario Selector */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Palette className="w-5 h-5 text-emerald-400" />
                            <label className="text-sm font-bold text-white uppercase tracking-wider">Style & Scenario</label>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                             {Object.values(PosterStyle).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStyle(s)}
                                    className={`p-2 rounded-lg text-xs font-medium transition-all border h-16 flex flex-col items-center justify-center text-center ${
                                        style === s 
                                        ? 'bg-emerald-900/30 border-emerald-500 text-emerald-200' 
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-800"></div>

                    {/* Technical Settings */}
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Aspect Ratio</label>
                            <select 
                                value={aspectRatio} 
                                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 px-2 text-xs text-white outline-none focus:border-slate-500"
                            >
                                {Object.values(AspectRatio).map((ratio) => (
                                    <option key={ratio} value={ratio}>{ratio}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Resolution</label>
                            <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-700">
                                {Object.values(ImageResolution).map((res) => (
                                    <button
                                        key={res}
                                        onClick={() => setResolution(res)}
                                        className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${
                                            resolution === res
                                            ? 'bg-slate-700 text-white'
                                            : 'text-slate-500 hover:text-slate-300'
                                        }`}
                                    >
                                        {res}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-widest text-lg flex items-center justify-center gap-3 transition-all ${
                                isGenerating 
                                ? 'bg-slate-700 text-slate-400 cursor-wait' 
                                : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black shadow-xl shadow-orange-500/20 transform hover:-translate-y-0.5'
                            }`}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6 fill-black" />
                                    Generate
                                </>
                            )}
                        </button>
                        {!hasApiKey && (
                            <p className="text-center text-[10px] text-slate-500 mt-2">
                                Requires Google Cloud API Key
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </main>

      {generatedImage && (
        <ResultView 
            imageUrl={generatedImage} 
            onClose={() => setGeneratedImage(null)}
            onRegenerate={handleGenerate}
        />
      )}
    </div>
  );
};

export default App;