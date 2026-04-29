import { Component, computed, OnInit, signal } from '@angular/core';
import { AnalysisService } from '../../../services/analysis.service';

@Component({
  selector: 'app-key-features',
  imports: [],
  templateUrl: './key-features.html',
  styleUrl: './key-features.css',
})
export class KeyFeatures implements OnInit {

  prediction = signal<string | null>(null);

  constructor(private analysis: AnalysisService) {}

  ngOnInit() {
    this.analysis.result$.subscribe(res => {
      if (res) {
        this.prediction.set(res.class_name);
      }
    });
  }

  // 🔥 Feature dictionary
  featureMap: Record<string, string[]> = {
    MEL: [
      'Asimetría en forma o color',
      'Bordes irregulares o mal definidos',
      'Variación de colores (marrón, negro, rojo)',
      'Diámetro mayor a 6 mm o crecimiento rápido'
    ],
    NV: [
      'Color uniforme (generalmente marrón)',
      'Bordes bien definidos y regulares',
      'Forma simétrica',
      'Tamaño estable en el tiempo'
    ],
    BKL: [
      'Superficie verrugosa o escamosa',
      'Aspecto “pegado” a la piel',
      'Color marrón claro a oscuro',
      'Lesión benigna sin crecimiento agresivo'
    ],
    BCC: [
      'Lesión perlada o translúcida',
      'Presencia de vasos sanguíneos visibles',
      'Ulceración o costra central',
      'Crecimiento lento pero persistente'
    ],
    AK: [
      'Superficie áspera o escamosa',
      'Color rojizo o marrón claro',
      'Ubicación en zonas expuestas al sol',
      'Lesión precancerosa'
    ],
    DF: [
      'Nódulo firme al tacto',
      'Color marrón o rosado',
      'Signo del hoyuelo (al presionar)',
      'Lesión benigna y estable'
    ],
    VASC: [
      'Color rojo, púrpura o azul',
      'Origen vascular (vasos sanguíneos)',
      'Puede blanquear al presionar',
      'Generalmente benigno'
    ],
    SCC: [
      'Lesión escamosa o ulcerada',
      'Crecimiento progresivo',
      'Puede sangrar fácilmente',
      'Asociado a daño solar crónico'
    ],
    '?': [
      'Características no específicas',
      'Requiere evaluación clínica',
      'Posible variabilidad en apariencia',
      'Considerar diagnóstico diferencial'
    ]
  };

  // 🔥 Reactive features
  features = computed(() => {
    return this.featureMap[this.prediction() ?? ''] || [];
  });
}