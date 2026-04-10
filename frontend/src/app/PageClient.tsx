'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CalculatorPage } from '../entities/calculator/CalculatorSection';

export default function PageClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarChapterOpen, setIsSidebarChapterOpen] = useState(true);
  return (
    <section>
      <div className="container ">
        <CalculatorPage />
      </div>
    </section>
  );
}
