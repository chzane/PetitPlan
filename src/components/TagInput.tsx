import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { XIcon, PlusIcon } from "lucide-react"


// 标签输入器
function TagInput({ value = [], onChange }: { value?: string[], onChange?: (tags: string[]) => void }) {
    const [tags, setTags] = useState<string[]>(value)
    const [newTag, setNewTag] = useState<string>("")

    const updateTags = (newTags: string[]) => {
        setTags(newTags)
        onChange?.(newTags)
    }

    const handleAddTag = () => {
        const trimmed = newTag.trim()
        if (trimmed && !tags.includes(trimmed)) {
            updateTags([...tags, trimmed])
            setNewTag("")
        }
    }

    const handleRemoveTag = (tag: string) => {
        updateTags(tags.filter((t) => t !== tag))
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-muted px-2 py-1 rounded-full text-sm">
                        {tag}
                        <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveTag(tag)}
                        >
                            <XIcon className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <Input
                    value={newTag}
                    placeholder="输入标签"
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddTag()
                        }
                    }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default TagInput