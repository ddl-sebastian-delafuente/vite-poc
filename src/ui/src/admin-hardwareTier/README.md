# Compute Grid Hardware Tier Table

Components for Domino admin Hardware Tier view

## Components

#### Component Props

1. hardwareTierRows<>
2. canManage<boolean>

#### Base Components

1.  Table

## Visual Elements

#### Columns

1. Id
2. Name
3. ClusterType
4. Cores
5. Cores Limit
6. Memory (GiB)
7. Overprovision pods
8. Node pool
9. Is Default
10. Is Visible
11. Is Global
12. Edit Action (conditional on "Kubernetes" ClusterType and canManage boolean)
13. Clone Action (conditional on "Kubernetes" ClusterType and canManage boolean)
14. Archive Action (conditional on canManage boolean)


