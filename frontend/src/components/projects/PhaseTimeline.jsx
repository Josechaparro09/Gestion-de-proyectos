import { useMemo } from 'react';
import {
  CheckCircleIcon,
  PlayCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const phaseIcons = {
  completed: CheckCircleIcon,
  current: PlayCircleIcon,
  upcoming: ClockIcon
};

export const PhaseTimeline = ({ phases, currentPhase }) => {
  const getPhaseStatus = (index) => {
    if (index < currentPhase) return 'completed';
    if (index === currentPhase) return 'current';
    return 'upcoming';
  };

  const phasesList = useMemo(() => {
    return phases.map((phase, index) => ({
      ...phase,
      status: getPhaseStatus(index)
    }));
  }, [phases, currentPhase]);

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {phasesList.map((phase, index) => {
          const Icon = phaseIcons[phase.status];
          return (
            <li key={phase.faseId}>
              <div className="relative pb-8">
                {index !== phases.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                        phase.status === 'completed'
                          ? 'bg-green-500'
                          : phase.status === 'current'
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                    >
                      <Icon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 py-1.5">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        {phase.nombre}
                      </span>
                      {' • '}
                      <span>
                        {phase.progreso}% completado
                      </span>
                      {phase.fechaInicio && (
                        <>
                          {' • '}
                          <span>
                            {format(new Date(phase.fechaInicio), 'd MMM yyyy', { locale: es })}
                          </span>
                        </>
                      )}
                      </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            phase.status === 'completed'
                              ? 'bg-green-500'
                              : phase.status === 'current'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                          }`}
                          style={{ width: `${phase.progreso}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>)}