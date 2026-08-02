const fs = require('fs');
const path = 'src/components/admin/UpdateProfileClient.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('  | "scanReports";', '  | "scanReports"\n  | "homepageProjects";');

const emptyFn = unction createEmptyHomepageProject(): IAdminHomepageProjectEditor {
  return {
    title: "",
    url: "",
    order: 0,
  };
}

function createEmptyScanReport;
content = content.replace('function createEmptyScanReport', emptyFn);

const section =               <RepeatableSection
                title="Homepage Projects"
                description="Rotating projects shown in the homepage header component."
                count={data.homepageProjects.length}
                addLabel="Add project"
                onAdd={() =>
                  addCollectionItem("homepageProjects", createEmptyHomepageProject())
                }
              >
                {data.homepageProjects.map((item, index) => (
                  <ItemCard
                    key={\homepage-project-\\}
                    title={\Project \\}
                    onMoveUp={() => moveCollectionItem("homepageProjects", index, -1)}
                    onMoveDown={() =>
                      moveCollectionItem("homepageProjects", index, 1)
                    }
                    onRemove={() => removeCollectionItem("homepageProjects", index)}
                    disableMoveUp={index === 0}
                    disableMoveDown={index === data.homepageProjects.length - 1}
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateCollectionItem("homepageProjects", index, "title", value)
                        }
                        placeholder="Project Name"
                      />
                      <TextField
                        label="URL"
                        value={item.url}
                        onChange={(value) =>
                          updateCollectionItem("homepageProjects", index, "url", value)
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </ItemCard>
                ))}
              </RepeatableSection>

              <RepeatableSection
                title="Skills";

content = content.replace(/              <RepeatableSection\s+title="Skills"/, section);

fs.writeFileSync(path, content);
console.log('done');
