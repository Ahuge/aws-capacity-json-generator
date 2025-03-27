import { useEffect, useState } from "react";
import {importFromVantage, exportToVantageUrl} from "@/lib/vantage.sh.ts";
import {InstanceManagerProps} from "@/lib/props.ts";

export function InstanceManager({ onUrlPasted, selectedInstances }: InstanceManagerProps) {
  const [vantageUrl, setVantageUrl] = useState('');
  const [instanceData, setInstanceData] = useState({
    filter: [],
    selected: [],
    compareOn: false,
    isValid: false
  });

  useEffect(() => {
    if (selectedInstances?.length > 0) {
      setInstanceData(prev => {
        return {
          ...prev,
          selected: selectedInstances
        }
      })
      setVantageUrl(exportToVantageUrl({
        filter: selectedInstances,
        selected: selectedInstances,
        compareOn: true
      }));
    }

  }, [selectedInstances]);

  // Auto-import whenever the URL changes
  useEffect(() => {
    if (vantageUrl.trim()) {
      console.log(vantageUrl)
      const data = importFromVantage(vantageUrl);
      setInstanceData(data);

      // Auto-generate export URL if valid
      if (data.isValid) {
        onUrlPasted(data.selected)
      }
    } else {
      // Clear if empty
      setInstanceData({
        filter: [],
        selected: [],
        compareOn: false,
        isValid: false
      });
    }
  }, [vantageUrl]);

  return (
    <div className="space-y-4 p-4">

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">URL for instances.vantage.sh:</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={vantageUrl}
            onChange={(e) => setVantageUrl(e.target.value)}
            placeholder="Paste instances.vantage.sh URL"
            className="flex-1 p-2 border rounded"
          />
          {vantageUrl && (
            <a
              href={vantageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Open
            </a>
          )}
        </div>
        {!instanceData.isValid && vantageUrl && (
          <p className="text-red-500 text-sm">Invalid instances.vantage.sh URL</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <h3 className="font-medium">Selected Instances ({instanceData.selected.length})</h3>
          <div className="border rounded p-2 h-44 overflow-y-auto">
            {instanceData.selected.length > 0 ? (
              instanceData.selected.sort().map(instance => (
                <div key={instance} className="py-1">
                  {instance}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No selected instances</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}