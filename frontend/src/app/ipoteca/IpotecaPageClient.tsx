'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import СalculatorHeader from '../../entities/calculator/calculator-header/СalculatorHeader';
import { CalculatorCard } from '../../entities/calculator/calculator-card/CalculatorCard';
export default function IpotecaPageClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarChapterOpen, setIsSidebarChapterOpen] = useState(true);
  return (
    <section>
      <div className="container ">
        <div className="min-h-screen bg-obsidian-950 text-obsidian-50 rounded-[12px] py-[25px] px-[15px] mt-[20px]">
          <СalculatorHeader
            pretitle="Рассчетный калькулятор"
            title="Рассчитай"
            span1="CВОЮ"
            span2="квартиру"
            description="Рассчитайте квартиру(дом), срок погашения и годовую процент
            "
          />
          <div className="col-sm-12">
            <h2 className="text-xl lg:text-3xl font-black tracking-tight text-obsidian-50 tracking-wides text-center mb-3">
              Популярные ипотечные программы в 2026 году:
            </h2>
            <h6 className="text-m lg:text-xl font-black tracking-tight  text-center mb-3">
              Льготные программы с господдержкой
            </h6>
            <div className="row space-row-20 flex flex-wrap">
              <div className="col-sm-3 ">
                <CalculatorCard
                  label="Семейная ипотека:"
                  value={'Ставка до 6%,'}
                  sub={
                    ' доступна во многих банках,включая Т-Банк, ВТБ, Сбербанк.'
                  }
                  delay={160}
                  className="dfm"
                />
              </div>
              <div className="col-sm-3 ">
                <CalculatorCard
                  label="IT-ипотека: "
                  value={'Для специалистов аккредитованных IT-компаний'}
                  sub={'Сбер, ВТБ, ДОМ.РФ, Альфа.'}
                  delay={160}
                  className="dfm"
                />
              </div>
              <div className="col-sm-3 ">
                <CalculatorCard
                  label="Дальневосточная и Арктическая ипотека: "
                  value={'Банки-участники:'}
                  sub={'Банк ДОМ.РФ, Примсоцбанк, ВБРР. '}
                  delay={160}
                  className="dfm"
                />
              </div>

              <div className="col-sm-3 ">
                <CalculatorCard
                  label="Сельская ипотека: "
                  value={'Банки-участники:'}
                  sub={'Россельхозбанк, Центр-инвест '}
                  delay={160}
                  className="dfm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
