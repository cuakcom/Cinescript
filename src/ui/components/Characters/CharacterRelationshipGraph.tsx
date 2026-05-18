import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import coseLayout from 'cytoscape-cose-bilkent';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import styles from './CharacterRelationshipGraph.module.css';

cytoscape.use(coseLayout);

interface GraphNode {
  data: {
    id: string;
    label: string;
  };
}

interface GraphEdge {
  data: {
    id: string;
    source: string;
    target: string;
    label: string;
    tension: number;
  };
}

export const CharacterRelationshipGraph: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const project = useSelector((state: RootState) => state.project.current);

  useEffect(() => {
    if (!containerRef.current || !project) return;

    // Build nodes from characters
    const nodes: GraphNode[] = project.characters.map(char => ({
      data: {
        id: char.id,
        label: char.name,
      },
    }));

    // Build edges from relationships
    const edges: GraphEdge[] = [];
    const edgeSet = new Set<string>();

    project.characters.forEach(char => {
      char.relationships.forEach(rel => {
        const edgeId = [char.id, rel.targetCharacterId].sort().join('-');
        if (!edgeSet.has(edgeId)) {
          edgeSet.add(edgeId);
          edges.push({
            data: {
              id: edgeId,
              source: char.id,
              target: rel.targetCharacterId,
              label: rel.type,
              tension: rel.tension,
            },
          });
        }
      });
    });

    // Initialize Cytoscape
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#3498db',
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': '60px',
            'height': '60px',
            'font-size': '12px',
            'color': '#fff',
            'font-weight': 'bold',
            'border-width': '2px',
            'border-color': '#2980b9',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#e74c3c',
            'border-color': '#c0392b',
            'border-width': '3px',
          },
        },
        {
          selector: 'edge',
          style: {
            'line-color': (ele: cytoscape.EdgeSingular) => {
              const tension = ele.data('tension') as number;
              if (tension > 70) return '#e74c3c';
              if (tension > 40) return '#f39c12';
              return '#27ae60';
            },
            'target-arrow-color': (ele: cytoscape.EdgeSingular) => {
              const tension = ele.data('tension') as number;
              if (tension > 70) return '#e74c3c';
              if (tension > 40) return '#f39c12';
              return '#27ae60';
            },
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'width': (ele: cytoscape.EdgeSingular) => {
              const tension = ele.data('tension') as number;
              return 1 + (tension / 100) * 3;
            },
            'label': 'data(label)',
            'font-size': '10px',
            'text-background-color': '#fff',
            'text-background-opacity': 0.8,
            'text-background-padding': '2px',
          },
        },
      ],
      layout: {
        name: 'cose-bilkent',
        animate: true,
        animationDuration: 500,
        randomize: false,
        nodeSpacing: 10,
        edgeLengthVal: 100,
      } as any,
      wheelSensitivity: 0.1,
      minZoom: 0.5,
      maxZoom: 3,
    });

    // Add interactivity
    cyRef.current.on('tap', 'node', (event: cytoscape.EventObject) => {
      const node = event.target as cytoscape.NodeSingular;
      cyRef.current?.elements().removeClass('selected');
      node.addClass('selected');
      node.connectedEdges().addClass('highlighted');
    });

    cyRef.current.on('tap', (event: cytoscape.EventObject) => {
      if (event.target === cyRef.current) {
        cyRef.current?.elements().removeClass('selected', 'highlighted');
      }
    });

    // Fit graph to container
    setTimeout(() => {
      cyRef.current?.fit(undefined, 50);
    }, 100);

    return () => {
      cyRef.current?.destroy();
    };
  }, [project]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Character Relationships</h2>
        <p className={styles.legend}>
          <span className={styles.positive}>● Ally</span>
          <span className={styles.neutral}>● Neutral</span>
          <span className={styles.conflict}>● Conflict</span>
        </p>
      </div>
      <div className={styles.graphContainer} ref={containerRef} />
    </div>
  );
};
