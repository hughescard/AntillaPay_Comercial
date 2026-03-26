type AreaChartProps = {
  points: number[];
  height?: number;
  stroke?: string;
  startLabel?: string;
  endLabel?: string;
};

export const AreaChart = ({
  points,
  height = 220,
  stroke = "#635bff",
  startLabel,
  endLabel,
}: AreaChartProps) => {
  const width = 680;
  const safePoints = points && points.length > 1 ? points : [0, 1];

  let min = safePoints[0];
  let max = safePoints[0];
  for (let i = 1; i < safePoints.length; i++) {
    if (safePoints[i] < min) min = safePoints[i];
    if (safePoints[i] > max) max = safePoints[i];
  }
  
  const range = max - min || 1;

  const paddingY = 2; 
  const innerHeight = height - paddingY * 2;

  const toX = (index: number) => (index / (safePoints.length - 1)) * width;
  
  const toY = (value: number) => 
    paddingY + innerHeight - ((value - min) / range) * innerHeight;

  const linePath = safePoints
    .map((value, index) => `${index === 0 ? "M" : "L"} ${toX(index)} ${toY(value)}`)
    .join(" ");
    
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="rounded-2xl px-4 py-4 w-full min-w-0 overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.24" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGradient)" stroke="none" />
        <path 
          d={linePath} 
          fill="none" 
          stroke={stroke} 
          strokeWidth="2" 
          strokeLinejoin="round" 
        />
      </svg>
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{startLabel}</span>
        <span>{endLabel}</span>
      </div>
    </div>
  );
};