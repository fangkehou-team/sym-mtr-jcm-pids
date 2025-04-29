# 定义压缩包的名称
PACKAGE_NAME := SYM_PIDS-Pack.zip

# 定义要包含的文件和文件夹
FILES := pack.png pack.mcmeta assets

# Development Dir, change this to your minecraft resource pack directory.
TARGET_DIR=/demo/.minecraft/resourcepack

# 默认目标
all: create_debug_dir copy_debug_files

# release a zip pack
release: $(PACKAGE_NAME)

# 创建压缩包
$(PACKAGE_NAME): $(FILES)
	zip -r $(PACKAGE_NAME) $(FILES)

# 清理
clean:
	rm -f $(PACKAGE_NAME)
	rm -rf $(TARGET_DIR)/*


# 创建目标文件夹的规则
create_debug_dir:
	mkdir -p $(TARGET_DIR)

# 复制文件的规则
copy_debug_files:
	cp -r * $(TARGET_DIR)

