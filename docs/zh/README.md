# 介绍

本项目是沈阳地铁资源包项目的附属项目，负责使用MTR4，JCM模组复刻沈阳地铁系统内的所有PIDS。

目前已经复刻的PIDS有：

- [站厅层双向本次列车](pids/concourse_level.md)
- [站厅层终点站](pids/concourse_level_destination.md)
- [站台层本次列车下次列车（4号线之后拥挤度版本）](pids/platform_level_after4.md)
- [站台层本次列车下次列车（4号线之前欢迎语版本）](pids/platform_level_before4.md)
- [站台层终点站](pids/platform_level_destination.md)

每个类型均有侧边栏在左和侧边栏在右的两种版本。

本项目目前支持两种配置方式：

- [通过配置文件进行配置（构建一个附加资源包）](config/file.md)
- [通过自定义信息进行配置](config/custom.md)

两种方式可以叠加，自定义信息配置项会覆盖文件配置项。

具体内容请进入相应文档查看。

