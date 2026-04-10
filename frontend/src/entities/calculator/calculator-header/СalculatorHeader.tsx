import { useState, useCallback, FC } from 'react';
import { useCalculator } from '../../../shared/hooks/useCalculator';
import { CalculatorForm } from '../CalculatorForm';
import { ResultsPanel } from '../ResultsPanel';

type CalculatorHeaderProps = {
  pretitle?: string;
  title?: string;
  span1?: string;
  span2?: string;
  description?: string;
};

const СalculatorHeader: FC<CalculatorHeaderProps> = ({
  pretitle,
  title,
  span1,
  span2,
  description,
}) => {
  return (
    <div className="text-center mb-4 lg:mb-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/20 bg-gold-500/5 px-4 py-1.5 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
        <span className="text-xs font-medium text-gold-400 tracking-widest uppercase">
          {pretitle}
        </span>
      </div>
      <h1 className="text-3xl lg:text-6xl font-black tracking-tight text-obsidian-50 tracking-widest mb-4 leading-none">
        {title}
        <br />
        <span className="text-gold-500 tracking-widest  uppercase">
          {span1}{' '}
        </span>
        <span className="text-gold-400 tracking-widest  ">{span2}</span>
      </h1>
      <p className="text-obsidian-400 text-base lg:text-lg max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
};

export default СalculatorHeader;
