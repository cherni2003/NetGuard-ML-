# NetGuard ML - Détection d'Anomalies Réseau

Application web full-stack pour la détection d'anomalies sur des séries temporelles réseau (données CESNET) basée sur un modèle LSTM + MinCovDet (Mahalanobis).

## Structure du projet

- \ackend/\ : API FastAPI (Python 3.10) exposant le modèle LSTM entraîné et les algorithmes de détection d'anomalie.
- \rontend/\ : Interface utilisateur React (Vite + TypeScript + TailwindCSS + Recharts) pour la visualisation en temps réel.
- \models/\ : Contient les poids du modèle Keras et les scalers/configs associés.

## Lancement Rapide (Docker)

Assurez-vous d'avoir Docker et Docker Compose installés.

1. Clonez ce dépôt.
2. (Optionnel) Copiez les fichiers de test \.npy\ dans \models/\ si vous souhaitez utiliser la simulation de flux de test en temps réel.
3. Lancez la stack complète :
   \\\ash
   docker-compose up --build
   \\\
4. L'interface est accessible sur [http://localhost:5173](http://localhost:5173).
5. L'API est accessible sur [http://localhost:8000](http://localhost:8000) (Swagger UI sur \/docs\).

## Architecture de Détection
1. **Modèle LSTM** : Prend une fenêtre de 24 pas de temps (18 features) pour prédire 6 métriques clés (groupe Volume et groupe Comportement).
2. **Score Composite** : Moyenne des z-scores des résidus absolus entre prédiction et réalité (seuil au 95e percentile).
3. **Alerte MCD (Mahalanobis)** : Calcul robuste de la distance de Mahalanobis séparément pour le Volume et le Comportement pour isoler des clusters d'anomalies multivariées (seuil chi2, alpha=0.01).

## Améliorations Futures
- Connecter à un flux Kafka réel (actuellement limité à l'importation de CSV / simulation).
- Ajouter des graphiques Recharts plus poussés dans l'onglet "Analyse détaillée" avec le \lstm_X_test.npy\.
